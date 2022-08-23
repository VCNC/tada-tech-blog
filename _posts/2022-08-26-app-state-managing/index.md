---
layout: post
date: 2022-08-26 10:00:00 +09:00
permalink: /2022-08-26-app-state-managing

title: '타다 드라이버 앱 상태관리 개선하기'
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
description: 프로덕트 생산성 및 안정성 향상을 위해 TADA Driver 애플리케이션의 상태관리 모듈을 개선한 경험의 공유


tags: ['android', 'redux', 'state']

authors:
  - name: 'Jacob Kim'
    link: https://sanggggg.me/
---

안녕하세요, 프로덕트 생산성 및 안정성 향상을 위해 TADA Driver 애플리케이션의 상태관리 방식을 개선한 경험을 공유하려고 합니다.

타다 팀의 Core Silo 는 타다 팀 내의 타 목적조직이 빠른 실험과 개선을 진행할 수 있도록 기반 작업을 수행하고 있습니다. 따라서 Core Silo 에 소속된 개발팀의 중요한 목표는 프로덕트의 안정성과 프로덕트 생산성 개선입니다.

특히 타다 드라이버 앱은 타다 운행을 위해 택시 기사님들이 사용하는 전용 애플리케이션으로, 앱 내의 이슈 사항으로 인해 운행을 지속하지 못하게 될 경우 실제 운행 지표에 중요한 영향 끼치거나 기사님들의 플랫폼의 신뢰도가 하락하는 굵직한 문제들이 발생합니다.
타 목적조직에서 목표를 위해 나아가기 위한 빠른 실험과 개선을 통해 프로덕트의 성숙도를 끌어올리는 과정에서 개발 속도 (프로덕트 생산성) 또한 개선해야하는 지표 중 하나 입니다.

위 두 지표를 개선하기 위해 현재 팀 내에 존재하는 문제 상황들을 분석하고, 적절한 솔루션을 찾아 해결한 과정을 공유해 보려고 합니다.

### 팀 내에 존재하는 문제상황

#### 1. 프로덕트 특성상 깊고 복잡한 상태들이 존재하며, 이런 상태에 얽힌 도메인 로직 또한 복잡해 마음 놓고 수정하기 힘들다.
타다 드라이버 앱은, 일반적인 앱들에 비해 깊고 복잡한 State Tree 를 가지고 있습니다. 기본적인 앱 로그인 / 로그아웃 상태, 로그인 상태라면 현재 택시를 운행중인지, 운행 중이라면 고객을 태운 상황인지, 운행과 별도로 존재하는 다음에 수행할 예약 운행이 있는지 등등... 이와 같은 깊고 복잡한 (Nested & Deep) 상태를 잘 관리할 수 있도록 RIBs 라는 아키텍쳐를 선택한 것 또한 위의 상황을 잘 보여주고 있습니다.

![RIB Tree]()
> 현재 타다 드라이버 앱 내의 State Tree 를 유추할 수 있는 RIB Tree

복잡한 상태를 가진 만큼 그 상태 변경 로직은 다양한 상황 및 도메인 로직을 고려해야 합니다. 서버와 클라이언트 간의 상태를 싱크맞출 때도, 사용자의 인지 여부에 따라 특정 상태를 서버값으로 업데이트 하지 않는다, 처럼 X 상황에서는 Y 의 업데이트를 지연한다, 와 같은 도메인 지식이 충분하지 않은 상태에서 상태 변경 코드를 작성하면 버그를 만들어 낼 가능성이 높습니다.

```kotlin
fun updateStateAfterRideDropOff(/* ...  */) {
  // ...
  // 로직 참고 : https://www.notion.so/vcnccorp/CurrentForwardRide-2021-09-15-d380aa7f3e4e45e192a8657ac12fffa6
  if (currentRide.status.isIn(RideStatus.CANCELED, RideStatus.DROPPED_OFF)) {
      // 라이드의 DroppedOff 처리 시 미리배차 전환이 발생하니 currentRide 의 업데이트를 지연시킨다.
      if (ride != null) {
          dataStore.forwardRide.value = ride
      } else if (clearPendingRide) {
          // Pending 상태에서 아직 dataStore 에 남아있는 Ride 는 별도의 화면이 존재하지 않기 때문에 바로 날려버린다.
          if (currentForwardRide != null && currentForwardRide.acceptedAt == null) {
            // ...
          }
      }
  }
  // ...
}
```
> 상태 업데이트에서 발생하는 상황적 맥락은 위 예시 코드 & 주석을 통해서 간접 체험할 수 있습니다.

#### 2. 상태 변경에서 반복적으로 나타나는 bug fix 코드가 존재한다.

타다 드라이버 앱은 서버에서 변경된 상태를 클라이언트에 내려주는 방식으로 REST API의 응답, Grpc Push 등을 사용하고 있습니다. 이중화된 상태 변경 요인으로 인해 네트워크 상황에 따라 
논리적인 상태 변경 순서와 네트워크를 통해 전달된 상태 변경 순서가 상이해 지며 발생하는 버그들이 있었고 이를 위한 순서 보정 코드를 작성한다던지

동시에 Atomic 하게 발생해야 하는 상태 업데이트가 step by step 으로 발생하며 Observe 가 여러번 발생하거나 두 상태 업데이트간의 간섭으로 생기는 미묘한 동시성 버그, 이를 해결하기 위한 몽키 코드 등

상태관리에서 나타나는 이슈와 관련 bug 를 막기위한 코드가 중복적으로 발생하는 (또는 놓쳐지는...) 문제가 존재하였습니다.

#### 3. 버그 픽스 / 디버깅 시 특정 상태를 손쉽게 확인 및 재현하고싶다.

CS로 인입되는 버그 상황 중 일부는 앱 상태관리와 관련된 버그였습니다. 예를 들어 `"갑자기 택시 콜의 수락이 안 되어서 배차가 거절 당했다!"` 라는 CS가 존재했습니다.
단순 코드만 보고는 문제 상황을 유추하기가 어려웠고, 결국 앱 내 상태가 어떻게 변경되었는지 순서를 릴리즈에 로깅을 찍으면서 해당 문제가 발생한 상태를 알아내고 수정한 기억이 납니다. (앞서 말씀드린 상태 관리에서 발생하는 동시성 이슈가 원인이었습니다 :sad:)

비슷한 상황은 개발 도중에도 발생합니다. 특정 상태에 대응하는 UI 개발을 진행할 때 해당 상태를 만드는 것 자체가 쉽지 않은 경우가 존재합니다. 예를 들어, 실시간 택시 운행 완료 후 인접한 택시 예약이 존재할 때 노출되는 UI 를 바꾸고 싶다면

- 승객 앱으로 택시 예약을 생성하고
- 택시 기사 앱으로 택시 예약을 수락한 다음, 예약에 인접한 시간 까지 대기
- 또 다른 승객 앱으로 실시간 택시를 호출하여 택시 기사 앱으로 수락한 다음 운행을 완료

하는 복잡한 상태를 매번 긴 시간을 들여서 만들어야 하는 문제가 존재했습니다.

#### 문제가 많다... 어떻게 해결할 수 있을까?

위 문제들은 현재 코드 생산성에 병목이 되고 있는 문제이면서, 또한 상태관리 라는 공통 분모를 가지고 있는 문제였습니다.
따라서 각각을 쪼개어 지엽적인 해결을 할 수도 있었겠지만 근본적으로 클라이언트 팀의 니즈를 반영하는 상태관리 레이어를 개발하여 위 문제들을 함께 수정하려고 했습니다.

> 문제를 해결을 위한 가설은 아래와 같았습니다.
> 1. 상태 변화에 대한 테스트를 작성하여 변경에 대한 안정성을 만들면, 복잡한 상태로 인한 버그가 줄어들 것이다.
> 2. 상태 관리에서 반복적으로 나타나는 패턴을 플러그인화 하여 반복을 줄이고 관점 지향의 개발을 할 수 있도록 하면, 코드 반복 및 반복적으로 발생하는 버그를 줄일 수 있을 것이다.
> 3. 상태 변화에 대한 모니터링 (디버깅) 을 쉽게할 수 있는 방법을 만들면 개발 도중 / CS 대응의 효율성을 높일 수 있을 것이다.

앱 내 상태관리 레이어 개선 로드맵은 아래와 같았습니다.

- 앱 내의 상태를 관리하는 책임을 독립된 모듈로 분리하자.
- 분리된 모듈 내에서 상태 / 상태변화를 이해하고 변경하기 쉬운 구조를 만들어 보자.
- 관리하기 쉬워진 상태 관리 모듈을 바탕으로 / 디버깅 & 버그 픽스 효율화 / 상태 관리 방법 고도화를 진행하자.

앞으로의 글은 위 개선 과정을 설명하면서 진행하려고 합니다.

---

# 문제 해결을 위한 상태관리 레이어 개발 과정

#### 3. 상태의 변경이 발생하는 코드 레이어가 여기저기 분산되어 있고, 이로 인해 다양한 문제가 발생 중이다.

![상태관리 도식 before]()
> (구) 상태관리 코드가 분산되어 있는 형태

타다 드라이버 코드베이스에서는 기존 위와 같은 상태를 업데이트하는 코드들이 특정 추상화 계층에 몰려있지 않고, 내부적으로 RIBs Interactor 라고 부르는 소위 말하는 ViewModel 과 유사한 레이어에 분산되어 있었습니다.

별도의 계층을 두지 않는 만큼
- 계층의 주입이나 분리를 위한 부차적인 boilerplate 코드를 생산하지 않기에
- 피쳐 개발을 위한 빠른 생산성에
에 유리하였지만

대신
- 분산되어 있는 코드는 관리 측면에서 어려움
- 상태관리의 개선을 위한 관점 지향 컴포넌트 (Plugin) 추가 어려움
- 유닛 테스트 작성 힘듦

와 같은 이번 리팩토링으로 이루고자 하는 목표 달성에는 적합하지 않은 구조였습니다.

![상태관리 도식 after]()
> (현) 상태관리 코드가 응집되어 있는 형태

따라서 상태에 대한 변화를 만드는 코드를 모두 한 곳으로 응집시켰고, 이전 이 상태에 대해 변화를 일으키는 코드는 전부 이 응집된 모듈을 통해 이뤄지도록 수정하였습니다.

이 기계적인 작업의 결과는 매우 커다랗고, 수많은 메서드를 가지고 있는 Monster Module 이 되었습니다.
이제 우리가 해야할 일은 퍼져있던 로직이 한데 모인 Monster Module 을 내부적인 책임 분리나 확장에 용이한 Module 로 만드는 일이었습니다.

## 2. Redux style 의 상태관리 (StateMachine) 적용

늦게 밝히는 이야기 이지만, 타다에 재직하면서 iOS, WebFrontend 등의 다양한 기술스택을 경험해 보고 있습니다.
개인적으로 다양한 플랫폼을 돌아다니며 각각 다른 플랫폼에서 각광받는 패러다임 / 컨텍스트를 이해하고 상호 적용해 보는 것에 큰 관심이 있기 때문입니다.

그리고 이 과정에서 WebFrontend 팀의 작업을 함께 진행하며 Redux 를 사용하고 익숙해졌습니다.

Redux 사용하며 느낀 큰 장점들은
- Flux 로 대변되는 State Mutation(Action), State Subscription 의 개념은 기존 부터 MVVM + RxJava 로 익숙한 사용성이다.
- Action 과 State 에 대한 Middleware 의 도입을 통해 관점 중심의 개발을 할 수 있다.
- 중앙집중화된 상태 머신을 제공하여 이와 궁합이 잘 맞는 커다란 State Tree 를 가지는 프로덕트 요구사항에서 Fit 이 잘 맞는다.
이었습니다.

언급된 장점들은 대부분 타다 드라이버앱에 적합하고, 우리의 니즈를 해결하는데 큰 도움이 될 수 있을 것이라 판단하였고 Redux 를 바탕으로 상태관리를 담당하는 이하 `StateMachine` 을 만들기 시작하였습니다.

> 최초에는 Flux 에 더해 finate-state-machine 의 형태로 상태관리를 고려하고 있었기에 StateMachine 이라는 이름이 붙게 되었습니다.
> 하지만, 당장은 fsm 을 통한 타입 체킹 등의 이점을 들고오는 것 보다는 빠른 구현체를 만드는데 중점을 두어 현재와 같은 StateMachine 이 탄생하게 되었습니다.

```kotlin
interface StateMachine {
  val state: DataStream<State> // observe & instant get 이 가능한 내부 데이터 인터페이스 (BehaviorSubject 의 Wrapper 같은 느낌이다.)
  fun dispatch(action: Action)
}

interface Reducer {
  fun reduce(prevState: State, action: Action): State
}

interface Middleware {
  fun intercept(next: (Action) -> State): (Action) -> State
}
```

```kotlin
class MinimalStateMachineImpl {
  private val _state = MutableDataStream()
  override val state = DataStream()
  
  private val combinedReducer: Reducer // 주입 생략
  private val middlewares: List<Middleware> // 주입 생략

  @Synchronized
  override dispatch(action: Action) {
    val prevState = _state.value
    val nextStateGenerator = middlewares.fold(
      { action -> combinedReducer.reduce(prevState, action) }
    ) { next, middleware ->
     middleware.create(next)
    }
    _state.uppdate(nextStateGenerator(action))
  }
}

// ...
val stateMachine = MinimalStateMachineImpl()

stateMachine.dispatch(Action.ReceiveRide())
stateMachine.dispatch(Action.PickUp())
stateMachine.dispatch(Action.Arrive())
stateMachine.dispatch(Action.ClearRide())

stateMachine.state.observe { state ->
  // mutate ui on state changed!
}
```

Redux 의 간단한 매커니즘을 카피하여 동일하게 간단한 매커니즘의 인터페이스를 구축하고 실제 내용물을 구현하기 시작했습니다.

## 3. StateMachine 을 통해 해결하는 문제

### 상태 관리 책임 분리

이제 StateMachine 으로 우리 앱의 상태와 상태 변화들을 직렬화 하였으니, 이를 바탕으로 앞선 문제들을 다양하게 해결할 수 있게 되었다.

초기에 제시한 문제 중 Atomic 한 상태 업데이트의 경우 Action 에 대한 State Update 가 무조건 Atomic 하게 업데이트 되므로 이에 관한 문제를 최소화 시킬 수 있다.

### Middleware 를 통해 관점 지향으로 쉽게 확장가능한 요구사항 해결

상태관리 모듈을 개선하면서 중요하게 고려한 점 중 하나는 Middleware, Plugin 등으로 불리는 관점 중심의 개발이 가능해 지는지 여부였습니다.
실제 Redux 스타일의 Middleware 를 도입하면서 관점 중심의 개발이 가능해 졌고, 이 것이 앞선 팀 내 문제에서 어떤 문제들을 해결하였는지 소개드리려고 합니다.

#### `LoggerMiddleware`
앞서 언급된 요구사항은 _디버깅/CS 인입 시에 관련 Action 과 State 변화의 로그를 보고 빠르게 상황을 파악하고 싶다_ 였습니다.
따라서 상태 변화가 발생할 때 마다 그 변화를 Logging 하여 실시간으로 Log 를 보거나, 파일시스템에 저장하고 CS 인입에 전달 받을 수 있는 구조를 만들어 문제를 해결하였습니다.

```kotlin
class MinialLoggerMiddleware {
    override fun create(next: (DriverStateMachine.Action) -> DriverStateMachine.State): (DriverStateMachine.Action) -> DriverStateMachine.State {
        return { action ->
            val nextState = next(action)
            Timber.d("Action : ${action.toJson(minifiedMoshi)}")
            Timber.d("State  : ${nextState.toJson(minifiedMoshi)}")
            nextState
        }
    }
}
```

## `BlockActionWhileFetchingMiddleware`
앞서 제시된 문제 중 REST API 의 응답을 기다리는 중에 Grpc Push 가 꽂혀 매끄럽지 못한 사용성이 발생하는 문제는 `UpdateBlockerMiddleware` 의 추가로 해결하였습니다.
일반적인 REST API 호출의 시작/종료 시점에 락을 잡고 여는 액션을 추가하여 Update 를 호출 중 지연시키는 Middleware 를 만들었습니다.

```kotlin
class MinialBlockActionWhileFetching : DriverStateMachine.Middleware {
    // 실제로는 복수의 fetch 요청에 대한 페어링 등이 추가되어 있습니다.
    private val isFetchingRequest = AtomicBoolean(false)

    override fun create(next: (DriverStateMachine.Action) -> DriverStateMachine.State): (DriverStateMachine.Action) -> DriverStateMachine.State {
        return { action ->
            when {
                action is DriverStateMachine.Action.FetchingStarted -> {
                    isFetchingRequest.set(true)
                    next(action)
                }
                action is DriverStateMachine.Action.FetchingFinished -> {
                    isFetchingRequest.set(false)
                    next(action)
                }
                isFetchingRequest.get() -> prevState
                else -> next(action)
            }
        }
    }
}
```

## Flipper Middleware
디버깅을 위한 요구사항은 이미 LoggerMiddleware 에서 어느정도 충족되었지만 redux 를 쓸 때 디버깅 했던 것 처럼 interactive 한 디버깅 & state diff 등을 훌륭한 시각화로 보고 싶었습니다. 그때 모바일 플랫폼 디버깅 플랫폼인 Flipper 를 알게 되었고, 요건 사실 재미로 붙여보았는데 생각보다 state 와 action 을 GUI 로 tracking 하는 경험이 아주 좋았습니다.

### 테스트 환경 조성을 위한 밑거름

또한 복잡한 상태가 StateMachine 으로 책임이 넘어간 만큼, 이제 StateMachine 에 대한 Unit Test 환경을 구성하여 앱 내의 복잡한 상태에 대해서도 안정적으로 변경이 가능해졌다.
다양한 앱 내의 플로우를 돌리면서 `LoggerMiddleware` 를 통해 StateMachine Log (Action & State) 를 가져온 후, 이를 Test Case 로 변경하면
매 StateMachine 에 대해서 돌아가는 회귀 테스트를 손쉽게 만들 수 있는 것이다!

또한 현재 시도 중이지만, 아직 완료하지 못한 것은 전체적인 앱의 UI 가 StateMachine 의 State 에 의존하고 있으므로, 이 State 만 모킹한다면 쉽게 앱의 UI 를 표현할 수 있기에 이를 기반으로 UI Snapshot Test 를 진행할 수 있었다.

- 실제 StateMachine 의 상태를 특정 상태로 모킹하였을 때
- 그 상태에서 보여지는 UI 를 Snapshot 으로 촬영한 다음
- 이 Snapshot 을 기준으로 매번 변경이 있는지 여부로 Snapshot 자동화 테스트를 돌린다면

UI 에 대해서도 돌아가는 회귀 테스트를 만들 수 있는 것이다


StateMachine 모듈을 별도로 정의하고나서 우리가 할 수 있는 일은, 높은 도메인 지식을 가지고 있지 않다면 쉽게 건드려서는 안돼고, 심지어 잘 알아도 변경 시 쉽게 실수가 발생할 수 있는 StateMachine 를 안전하게 변경하기 위한 Unit Test 를 작성했다.


위와 같은 두 logic / UI Unit Test 를 통해서 제품에서 발생하는 신뢰도 이슈를 최소화 할 수 있을 것이라 기대하고 있다. (실제로 두 테스트를 도입한 후 프로덕션에 터지는 이슈들을 비교해 보면 재밌을 지도)


## 결론
타다 드라이버 안드로이드 코드베이스에서 발생하는 다양한 문제상황을 해결하기 위한 근본적인 해결책을 앱 내 상태 관리 개선으로 판단하고, 상태 관리 레이어 분리 / 상태 관리 방식 개선 / 실제 개선된 상태관리 방식으로 해결한 문제 상황들을 공유드렸습니다.

작업을 진행하며 실제 저희 안드로이드 코드베이스에서 발생하는 문제 상황 해결이라는 목적을 명확하게 파악하고, 집중하여 해결하는 과정이 즐거웠습니다.
특히 그 과정에서, Redux 스타일의 상태관리를 좀 더 가까워 지고 체화 시킬 수 있었던 점도 큰 도움이 되었던 것 같습니다.

아직
- test case 고도화
  - StateMachine Unit test 테스트 케이스 추가
  - 특정 State 일 때의 UI 스냅샷 테스트 진행
- StateMachine 내부적으로 State 관리하는 방식 변경
  - 상호 배타적인 상태를 명확하게 표현하기 위해 sealed class 를 좀 더 명시적으로 써서, state 를 명확하게 바라볼 수 있게 하기

이렇게 문제 해결을 위한 기술적인 고민을 함께하고, 논리적인 판단을 바탕으로 함께 타다 클라이언트 앱을 개발하실 분을 찾고 있습니다.


개인적인 회고로는 실제 안드로이드 코드베이스에서 발생하는 문제 상황 이라는 why 를 명확하게 파악하고, 필요에 의한 엔지니어링을 진행하면서 문제를 해결하는 과정이 재밌었다.
특히 그 과정에서, 막연하게 텍스트로만 느끼고 있던 Redux 스타일의 상태관리의 장/단을 체화 시킬 수 있었던 것도 큰 도움이 되었던 것 같다.

이렇게 문제 해결을 위해 기술적인 고민을 함께하고, 논리적인 판단을 바탕으로 실행에 옮기며 함께 타다 클라이언트 개발을 할 수 있는 사람을 찾고 있다.
관심 있으면 연락 달라.

















```kotlin
fun someMutation() {
    someDataStore.driverStatus.update(someStateWhichMeanOnRiding)
    // 이 변화로 1회 상태 변화가 감지되고
    someDataStore.currentRide.update(activeRiding)
    // 이 변화로 또 한 번 상태 변화가 감지되어
}
```

Atomic 하게 일어나야 하는 상태의 변경들이 순차적인 상태 업데이트로 전달되며 각 상태 업데이트에 대해 observation 이 발생하여 동시성과 관련된 미묘한 버그를 만들어낸다던가