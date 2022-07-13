---
layout: post
date: 2019-05-08 10:00:00 +09:00
permalink: /2019-05-08-tada-client-development
disqusUrl: http://engineering.vcnc.co.kr/2019/05/tada-client-development/

title: '타다 클라이언트 개발기'
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
description: 타다라는 완전히 새로운 서비스를 성공적으로 출시하기 위해 많은 고민을 하였습니다.
  고민 끝에 만들어진 타다의 클라이언트 프로젝트 구성과 이를 위해 사용한 여러 기술들을 소개하고
  그 동안의 타다 클라이언트 팀의 기술적 결정에 대해 소개하려고 합니다.

tags: ['VCNC', '타다', '클라이언트', 'Android', 'iOS', 'Android', 'iOS', '아키텍처', '설계', 'Kotlin', 'Swift']

authors:
  - name: 'Prince Kim'
    facebook: https://www.facebook.com/psycholic4
    link: https://www.instagram.com/psycholic4
---

앞서 종합 모빌리티 플랫폼인 **[타다][tada]** 의 시스템 설계를 위한 많은 고민과 기술적 결정들에 대해서 서버팀에서 소개한 바 있습니다. 이번 글에서는 타다 서비스를 출시하기까지 타다 모바일 클라이언트를 개발하는 과정에서 내린 클라이언트 팀의 전략적 결정들과, 타다 클라이언트를 개발하는데 사용한 기술들을 공유합니다.

## 시작 전 상황

- **3달 반의 개발 기간**: 타다는 VCNC가 SOCAR에 인수되면서 개발하게 된 서비스입니다. 빠르게 시장에 뛰어들어서 선점하는 것이 무엇보다 중요했기에 시간과의 싸움은 필수적이었습니다. 프로젝트는 6월에 시작되었고 1.0 출시는 추석 연휴 직전인 9월 중순으로 결정되었습니다. VCNC에서 오프라인 운영은 처음이었기 때문에 차량을 실제로 운행해보면서 사용성 경험을 테스트할 필요가 있었습니다. 그래서 8월 초에 사내 테스트용 알파 버전을 출시하기로 했습니다.
- **클라이언트 팀 통합**: 비트윈 때는 Android/iOS 팀이 나뉘어 있었습니다. 회사 인수 과정에서 발생한 조직 개편으로 인해 타다 클라이언트 개발자는 5명으로 이루어졌습니다. 전부터 다른 OS 개발도 경험하고 싶던 적극적이고 열정적인 5명의 멤버들은 과감하게 팀을 통합해서 Android/iOS을 함께 개발하기로 했습니다.
- **3개의 앱 개발**: 타다의 서비스를 위해서는 Android/iOS, 라이더/드라이버 총 4개의 앱을 제작해야 합니다. 하지만 시간과 일정을 고려했을 때 4개의 앱을 다 제작하기는 무리라고 판단을 했습니다. iOS에서는 내비게이션 앱을 사용 중에 드라이버 앱으로 손쉽게 전환하는 기능을 제공할 수 없고 내비게이션 앱으로 경로 안내를 요청하는 것도 제한적이기 때문에 iOS 드라이버 앱은 제작하지 않기로 했습니다.
- **무에서 시작한 프로젝트**: 타다는 코드 베이스가 없는 empty repository에서 시작했습니다. 언어도 바뀌었고 레거시 코드와도 엮이고 싶지 않았기 때문에 비트윈에서 어떠한 라이브러리도 가져오지 않고 전부 새로 만들기로 했습니다.

![5hero]

<figcaption>클라이언트 팀의 5명의 정예 용사들. by <a href="https://www.facebook.com/haansamkim">Sam</a></figcaption>

## 코드 아키텍처 - [RIBs]

프로젝트가 시작되고 기획이 진행되는 동안 3주의 시간을 기반 작업에 쓰기로 했습니다. 가장 먼저 진행한 것은 코드 아키텍처 정하기입니다. 당시에 제가 SAA(Single-Activity Application)에 관심을 가지고 있었는데, 때마침 Google I/O 2018의 세션 중 [Modern Android development: Android Jetpack, Kotlin, and more](https://youtu.be/IrMw7MEgADk?t=1674) 에서도 비슷한 언급이 나와서 팀에 제안했고, 본격적으로 조사를 해보았습니다. 팀원들이 조사를 진행해보니 Uber, Lyft, Grab 등 굴지의 모빌리티 서비스 회사들이 전부 SAA 기반으로 앱을 개발했다는 것을 알게 되었습니다. 무거운 리소스인 지도를 중심으로 화면이 구성되기에 반복적인 지도 리소스 할당/해제를 피하기 위한 필연적인 선택으로 보입니다. 큰 기업들이 수년간 서비스를 하며 문제를 느끼고 내린 선택인 만큼 저희도 따라가기로 결정했습니다. 비트윈 때 Activity Stack으로 인해 굉장히 고통을 겪은 적이 있는지라 SAA를 원하는 공감대도 있었고요.

SAA로 개발을 하기로 정한 이후에는 어떤 프레임워크를 사용해서 개발할지를 고민했습니다. 여러 개의 오픈소스를 비교할 때 **Android/iOS 간의 통일된 아키텍처로 개발할 수 있는지**를 가장 중점적으로 보았습니다. 대부분의 팀원이 한쪽 OS에만 익숙하기 때문에 초보임에도 빠르게 적응하고 개발하려면 비즈니스 로직을 구현하는 부분이 통일되어 있어야 한다고 생각했습니다. Uber의 [RIBs]는 저희의 이런 요구를 가장 잘 충족했습니다. 거기에 데이터의 scope와 전달 방식 명확해서 side-effect 없이 개발할 수 있다는 점, 그로 인해 효율적으로 협업이 가능하고 여러명이 개발한 RIB 을 레고 조립하듯 합쳐서 기능을 완성할 수 있다는 점에서 [RIBs]를 선택하게 되었습니다.

[RIBs]는 아키텍처를 이해하는 것 자체가 굉장히 난해합니다. 오픈소스 상으로 공개가 되지 않은 부분들도 있어서 저희의 입맛에 맞게 변형하는 데 매우 많은 시간을 할애했습니다.
[RIBs]와 관련한 내용은 [Nate(김남현)][nate]가 [Let'Swift 2018](http://letswift.kr/2018/)에서 발표한 **RxRIBs, Multiplatform architecture with Rx** 의 [영상](https://www.youtube.com/watch?v=BvPW-cd8mpw&index=6&list=PLAHa1zfLtLiNPl0RVd6WX6W_aa678RAmS) 및 [발표자료](https://speakerdeck.com/vcnc/rxribs-multiplatform-architecture-with-rx)를 참조하세요.

추후 [RIBs]를 상세하게 다루는 포스팅을 해보도록 하겠습니다.

## 서버와의 통신 프로토콜

새로운 서버 API가 생길 때마다 해당 API의 명세를 문서화하고 전달하는 것은 굉장히 불편한 일입니다. 또한 문서를 작성할 때나 클라이언트에서 모델 클래스를 생성할 때 오타가 발생할 수도 있습니다. 타다에서는 서버 클라이언트 간 API 규약을 [Protocol Buffer][protobuf]를 사용해서 단일화된 방법으로 정의하고 자동화하기로 했습니다. 모든 API의 url은 `.proto` 파일 이름으로 정형화되어 있고 `POST` body로 `Params` 객체를 JSON으로 serialization 해서 보내면 `Result` JSON이 응답으로 옵니다. 서버가 새로운 API를 개발할 때 `.proto` 파일만 push 하면 클라이언트에서 스크립트를 돌려서 Model 객체를 생성하고 해당 객체를 사용해서 호출만 하면 되는 아주 간단하고 편한 방식입니다.

참고로 타다의 서버군에 대한 설명은 [타다 시스템 아키텍처][tadasystemarchitecture]에 기술되어 있습니다.

## 기반 작업

타다는 빈 repository에서 시작한 깔끔한 프로젝트였기 때문에 Base 코드와 내부 라이브러리들을 전부 새로 개발했습니다.

- API Controller, gRPC Controller
  - 서버와의 통신에 필요한 모듈들을 개발했습니다. 모든 API는 Rx의 `Single`과 `Completable`로 wrapping 되어 있습니다.
- [RIBs]
  - 가장 자주 사용하는 Router 패턴들을 wrapping.
  - Android에서 구현이 공개되어 있지 않은 `ScreenStack` 구현.
  - SAA이므로 Android에서 Activity가 아닌 화면 단위의 로깅을 구현.
  - Router의 기초적인 화면 Transition을 구현
  - RIB 뼈대 코드용 template 파일 제작
- **Prefs(Android)/Store(iOS)**
  - 타다에서는 DB를 사용하지 않고 key-value store로만 데이터를 저장합니다. Android `SharedPreference`와 iOS `UserDefaults`의 wrapper를 만들었습니다. Object를 serialization 해서 저장하는 기능, Rx 형태의 getter, cache layer, crypto layer 등이 구현되어 있습니다.
- Design Support
  - Android에서 drawable을 생성하지 않고 `layout.xml` 상에서 border, corner-radius, masking을 쉽게 설정하기 위해서 제작했습니다.
- **[ButterKt]**
  - Android에서 View Binding 처리를 위해 개발했습니다. 비슷한 기능을 하는 [Kotter Knife][kotterknife], [Kotlin Android Extension][kotlinandroidextension]이 가지고 있는 lazy binding 문제를 해결하고 싶었고 가능하면 [Butter Knife][butterknife]와 달리 apt 없이 동작하는 라이브러리를 만들고 싶었습니다. 이와 관련된 저희의 생각은 [여기](https://www.rajin.me/dev/2018/08/05/ButterKt.html)에 [David(김진형)][david]이 상세하게 기록해 두었습니다. [코드][butterkt]도 공개되어 있으니 잘 활용해 보시길 바랍니다.
- Tools
  - Model Compiler
    - [PBAndK][pbandk], [swift-protobuf][swiftprotobuf]를 수정해 `.proto` 파일을 저희가 원하는 형태의 kotlin data class와 swift codable struct로 변환하는 스크립트를 구현했습니다.
  - Import Resource
    - UI/UX 팀에서 작업해서 Google Drive File Stream으로 공유하는 리소스를 프로젝트에 sync 하는 스크립트입니다. 타다에서는 기본적으로 벡터 포맷(Android xml, iOS pdf)을 사용하고 Android에서 벡터로 표현이 안되는 이미지들은 png를 사용합니다. 또한 애니메이션을 위한 [Lottie] json 파일도 사용합니다. 현재는 Android 용으로만 스크립트가 구현되어 있고 리소스를 프로젝트 내의 각각의 res 폴더에 sync 하는 기능과 svg로 전달받은 벡터 파일을 Android xml 형식으로 변환하는 기능을 포함합니다.
  - sync [Lokalise]
    - 타다에서는 [Lokalise]로 문자열 리소스를 관리합니다. `strings.xml`, `Localizable.strings` 파일로 다운받아서 프로젝트에 sync 하는 스크립트 입니다.
- Code Template & Settings
  - 개발 편의를 위한 간단한 Android Studio Code Template과 코드 통일성을 위한 idea settings를 공유합니다.

## 사용된 기술들

### OS 공통

- **[Firebase]**: Analytics, Crashlytics, Messaging, Storage 등 다양한 용도로 [Firebase]를 활용하고 있습니다.
- **[gRPC]**, **[ProtoBuf]**: 서버에서 실시간 Event를 받기 위해서 사용합니다.
- **[RIBs]**: 타다의 기반 아키텍처 입니다.
- **[Lottie]**: 애니메이션 요소를 표현하기 위해 사용합니다.
- **[Semver]**: 앱의 버전은 [Semantic Versioning][semver] 규약을 따라 정의합니다. 버전을 파싱하고 관리하기 위해서 [Nate(김남현)][nate]가 [Kotlin 버전][semverkt]과 [Swift 버전][semverswift]의 라이브러리를 제작하고 공개했습니다.
- **[Braze]**: CRM(Customer Relationship Management) 툴인 [Braze]는 유저를 타게팅해서 전면팝업을 띄우거나 푸시 알림을 발송하기 위해 사용합니다.
- **[TeamCity]**, **[Fastlane]**, **[Beta]**: CI/CD를 위해서 개발 초기에는 [Jenkins]를 사용했습니다. 출시 대응을 빠르게 하기 위해서 parallel build 및 우선순위 컨트롤을 하고 싶었는데 [Jenkins]의 Parallel build가 원하는 대로 동작하지 않아서 현재는 [TeamCity]로 이전했습니다. [Beta]를 사용해서 모든 브랜치의 빌드를 배포해서 QA 팀에서 테스트할 수 있게 했습니다. 출시용 빌드는 Android의 경우 아직은 수동 업로드를 하고 있고 iOS의 경우 [Fastlane]으로 배포합니다.
- **[git-flow]**: Git branching model로는 [git-flow]를 사용합니다. Branch의 종류에 따라서 [TeamCity]에서의 빌드 우선순위가 결정됩니다.

### Android

- **[Kotlin]**: 당연한 선택이겠죠? 타다의 모든 소스 코드는 Fork 해서 수정한 [RIBs]의 클래스들을 제외하면 전부 [Kotlin]으로 구현되어 있습니다.
- **[AndroidX]**: 타다 개발을 시작하는 순간에 [AndroidX]가 공개되었습니다. 기존 Support Library를 사용하게 되면 언젠가는 migration 해야 할 것이기 때문에 알파 버전임에도 불구하고 처음부터 사용하기로 했습니다. ConstraintLayout, PagingLibrary, Material Component, KTX 등 다양한 Component를 사용합니다.
- **[Retrofit]**, **[OkHttp]**: 서버와의 HTTP 통신을 위해서 사용합니다.
- **[RxJava]**: 클라이언트 팀은 Rx 없이는 개발할 수 없을 정도로 적극적으로 Rx를 활용합니다.
- **[AutoDispose]**: Rx subscription을 dispose 하기 위해서 사용합니다. 관련해서 도움이 될만한 글을 읽어보시는 것을 추천합니다. [Why Not RxLifecycle?](https://blog.danlew.net/2017/08/02/why-not-rxlifecycle/)
- **[RxBinding]**: View 이벤트를 Observable 형태로 바꿔주는 [RxBinding]은 굉장히 유용합니다.
- **[Moshi]**: JSON 라이브러리입니다. Kotlin data class와의 호환을 위해서 [Gson] 대신 선택했습니다.
- **[Glide]**: 이미지 로딩을 위해서 사용합니다.
- **[Detekt]**: Kotlin을 위한 static code analyzer 입니다. [Detekt]의 extension을 통해 [ktlint]도 활용하고 있습니다.
- **[Dagger]**: [RIBs]는 Dependency injection을 기반으로 합니다. [RIBs]에선 어떠한 DI system이든 사용할 수 있게 Builder가 분리되어 있습니다. [RIBs]에서는 [Dagger]로 설명이 되어 있고 저희도 마찬가지로 [Dagger]를 사용합니다.
- **[ThreeTen Backport][threeten]**: Java8의 날짜 및 시간 라이브러리인 `JSR-310`의 Java SE6 & 7을 위한 backport 라이브러리입니다. 문자열 파싱 및 시간 연산을 위해 사용합니다.

### iOS

- **[Swift]**: [Kotlin]과 마찬가지로 당연한 선택입니다. Swift4.2의 `CaseIterable` Swift5의 `Result` 등 항상 최신 버전의 Swift를 사용합니다.
- **[RxSwift]**: 역시나 reactive programming은 필수입니다.
- **[RxCocoa]**, **[RxGesture]**: iOS에서도 역시 모든 뷰 이벤트는 Rx 형태로 감지합니다.
- **[SnapKit]**: AutoLayout DSL을 제공하므로 코드상에서 편하게 Constraint를 조절할 수 있습니다.
- **[Moya/RxSwift][moya]**, **[Alamofire]**: Http 서버와의 통신을 위해 추상화된 네트워크 라이브러리인 [Moya]를 사용합니다. 역시나 Rx로 wrapping 된 버전을 사용하고 있습니다.
- **[Codable]**: Swift4부터 제공된 프로토콜로 JSON Encoding, Decoding으로 사용중입니다.
- **[Hero]**: [RIBs]의 Router가 attach/detach 될 때의 Transition을 처리하는데 이용합니다.
- **[Kingfisher]**: 이미지 로딩을 위해서 사용합니다.
- **[KeychainAccess]**: Access Token 같은 중요 정보를 안전하게 저장하기 위해 사용합니다.
- **[Swiftlint]**: SwiftLint는 fastlane action으로 실행해서 code validation을 합니다.

## 출시 후의 회고

짧은 시간에 여러 개의 앱을 만들기 위해서는 시간 및 인원을 아주 효율적으로 배분해야 했습니다. 각 OS의 기존 개발자들이 먼저 프로젝트 기반을 닦는 동안 나머지는 스터디를 진행했습니다. 차량 운영 경험을 쌓는 것이 알파 테스트의 목적이었으므로 일정에 맞추기 위해 드라이버 앱도 개발해야 하는 Android로만 알파 버전을 개발했습니다. 대신에 iOS 알파 버전은 서버팀 [YB(김영범)][yb]가 아주 빠르게 웹앱으로 개발해주었습니다(1.0은 Native입니다.). 알파 버전의 스펙도 호출-하차까지의 시나리오 외의 다른 부가 기능은 전부 제외했습니다.

회사 구성원들이 전부 처음 도전하는 분야였기에 기획을 포함해서 모두가 지속적인 변화에 대응해야 했습니다. 특히 사내 테스트를 시작한 직후 실제 운영을 해보며 깨닫고 변경한 기획 및 UX가 상당히 많았습니다. 개발적으로는 익숙하지 않은 아키텍처인 [RIBs]를 이해하며 개발하는 것이 생각 이상으로 난도가 높았고 개발하는 중간에도 큰 리팩터링을 여러 번 해야 해서 힘들었습니다. 이러한 이유들로 1.0 출시도 [시작 전 상황](#sijag-jeon-sanghwang)에서 언급한 것보다 2주 정도 미뤄졌습니다.

![timeline]

<figcaption>실제 타다 프로젝트 타임라인</figcaption>

하지만 저희는 **성공적으로 타다를 출시했습니다!** 아래는 팀 내에서 출시를 회고하며 나왔던 몇몇 의견입니다.

> OS 간 아키텍처가 통일되어서 한 명이 같은 기능을 두 OS 전부 개발할 때 굉장히 효율적이다. 비즈니스 로직의 경우 정말로 Swift <-> Kotlin간 언어 번역을 하면 되는 정도.

> 결과적으로 앱 개발 순서를 굉장히 잘 정했다. 한쪽을 먼저 빠르게 개발하고 문제점을 느껴보며 정비해 나가니까 프로젝트 후반부에 빠른 속도로 기능을 개발하는 데 도움이 되었다. 큰 수정을 양쪽 OS에 하지 않아도 됐던 게 좋았다.

> 짧은 기간 개발했음에도 앱 퀄리티가 굉장히 만족스럽다. 매 상황에서 기술적 선택, 인원 배분 등 경험에서 우러나온 아주 적절한 판단들을 했다고 생각한다.

> 각자 독립적으로 개발하던 기능들이 쉽게 합쳐지고 큰 문제없이 잘 동작하는 하나의 앱이 되는 과정이 정말 신기했다. 아키텍처 설계에 쓴 많은 시간이 결코 아깝지 않았다.

## 마치며

아직 저희가 하고 싶고 도전해야 하는 과제들은 무궁무진합니다. 그 중 간략히 몇 가지를 소개합니다.

- 테스트 코드 작성: 시간과의 싸움 속에서 테스트 코드 작성을 지금까지 미뤄왔습니다. [RIBs]의 Interactor 에 구현된 비즈니스 로직은 반드시 테스트 되어야 합니다.
- OS 간 구조 통일: 같은 화면임에도 OS 간 작업자가 다른 경우 많은 파편화가 일어났습니다. 1순위로 RIB tree 및 Interactor의 비즈니스 로직 통일하는 작업을 진행하고 있습니다. `AlertController` 같은 공통적인 컴포넌트들도 최대한 포맷을 통일하려는 작업을 지속해서 진행할 예정입니다.
- iOS DI: [RIBs]에서 Android에선 [Dagger]를 활용해서 쉽게 Builder 구현이 가능하지만, iOS에서는 좋은 방법이 없어서 수동으로 DI를 해결하고 있었습니다. 그래서 Uber가 개발 중인 [Needle]을 적용하려고 관심 있게 보고 있습니다.
- 네트워크 에러 handling 개선: 중첩돼서 뜨는 Alert를 해결하는 것, global 하게 에러를 처리하는 좋은 구조 찾기 등의 이슈가 있습니다.
- String Resource 관리: 개발하면서 생성하고 아직 [Lokalise]에 동기화하지 않은 리소스 키를 체크해서 빌드 오류를 발생시키려고 합니다. 또한 iOS에서 `"some_key".localize` 형태의 extension으로 번역을 코드상에서 불러오는데 key 값 오타가 나면 런타임에서만 오류를 알 수 있습니다. 따라서 String resource를 enum 형태로 관리하려고 합니다.

그 외 50여 가지나 되는 팀원들이 하고 싶은 백로그 목록이 여러분을 기다리고 있습니다. 타다가 성공적으로 런칭할 수 있었던 것은 **훌륭한 팀원**들이 있었기 때문입니다. 앞으로 저희와 함께 좋은 서비스를 만들어 나갈 멋진 분들의 많은 관심 바랍니다.

[tada]: https://tadatada.com/
[ribs]: https://github.com/uber/RIBs
[nate]: https://www.facebook.com/glwithu06
[david]: https://www.rajin.me
[yb]: https://www.facebook.com/youngboom.kim
[protobuf]: https://developers.google.com/protocol-buffers/
[tadasystemarchitecture]: /2019/01/tada-system-architecture/#system-architecture
[pbandk]: https://github.com/cretz/pb-and-k
[swiftprotobuf]: https://github.com/apple/swift-protobuf
[butterkt]: https://github.com/Rajin9601/ButterKt
[butterknife]: https://jakewharton.github.io/butterknife/
[kotterknife]: https://github.com/JakeWharton/kotterknife
[kotlinandroidextension]: https://kotlinlang.org/docs/tutorials/android-plugin.html
[lokalise]: https://lokalise.co/
[lottie]: https://airbnb.design/lottie/
[jenkins]: https://jenkins.io/
[teamcity]: https://www.jetbrains.com/teamcity/
[kotlin]: https://kotlinlang.org/
[retrofit]: https://square.github.io/retrofit/
[grpc]: https://grpc.io/
[swift]: https://swift.org/
[rxjava]: https://github.com/ReactiveX/RxJava
[autodispose]: https://github.com/uber/AutoDispose
[androidx]: https://developer.android.com/jetpack/androidx
[semver]: https://semver.org/
[semverkt]: https://github.com/glwithu06/Semver.kt
[semverswift]: https://github.com/glwithu06/Semver.swift
[glide]: https://github.com/bumptech/glide
[okhttp]: https://square.github.io/okhttp/
[moshi]: https://github.com/square/moshi
[gson]: https://github.com/google/gson
[firebase]: https://firebase.google.com/
[playservices]: https://developers.google.com/android/guides/overview
[detekt]: https://github.com/arturbosch/detekt
[ktlint]: https://github.com/pinterest/ktlint
[dagger]: https://google.github.io/dagger/
[braze]: https://www.braze.com/
[logback]: https://github.com/tony19/logback-android
[slf4j]: https://www.slf4j.org/
[threeten]: https://github.com/ThreeTen/threetenbp
[rxbinding]: https://github.com/JakeWharton/RxBinding
[rxswift]: https://github.com/ReactiveX/RxSwift
[snapkit]: https://github.com/SnapKit/SnapKit
[rxcocoa]: https://github.com/ReactiveX/RxSwift/tree/master/RxCocoa
[rxgesture]: https://github.com/RxSwiftCommunity/RxGesture
[moya]: https://github.com/Moya/Moya
[hero]: https://github.com/HeroTransitions/Hero
[alamofire]: https://github.com/Alamofire/Alamofire
[kingfisher]: https://github.com/onevcat/Kingfisher
[keychainaccess]: https://github.com/kishikawakatsumi/KeychainAccess
[beta]: https://docs.fabric.io/apple/beta/overview.html
[fastlane]: https://fastlane.tools/
[swiftlint]: https://docs.fastlane.tools/actions/swiftlint/
[timeline]: ./timeline.png
[needle]: https://github.com/uber/needle
[git-flow]: https://nvie.com/posts/a-successful-git-branching-model/
[5hero]: ./hero.jpg
[codable]: https://developer.apple.com/documentation/swift/codable
