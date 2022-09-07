---
layout: post
date: 2022-09-02 10:00:00 +09:00
permalink: /2022-09-02-ddd-settlement

title: '정산 도메인 정리하기'
thumbnail:
- color: ./thumbnail-color.png
  gray: ./thumbnail-gray.png
  description: 정산 도메인에 도메인 주도 설계를 적용하고 구현해나아가는 과정

tags: ['DDD', '정산', '리팩토링']

authors:
  - name: 'Lauv Cho'
    comment: 성장에 목말라 있는 주니어 서버 개발자입니다.
    profileImage: './profile-image-lauv.jpeg'
    link: https://github.com/ko-ing
---

## 도메인 정리를 시작하게 된 이유
타다 서버팀이 최근 마주한 가장 큰 문제 중 하나는 코드 상 도메인 간의 강결합과 그에 따른 복잡성이라고 생각했습니다.
에릭 에반스의 도메인 주도 설계를 스터디하며, 기획자/도메인 전문가와 개발자 사이의 다른 이해도, 그에 따른 단방향적 커뮤니케이션과 구현이
코드의 복잡성을 가중시킬 수 있다는 것을 깨달았습니다. 그리고 타다팀 역시 이 문제를 겪고 있다고 생각했습니다.

서비스가 고도화됨에 따라 확장성을 늘리고 더 효율적인 의사소통을 해나가기 위해서는 코드-모델-설계을 유기적으로 관리하는 것이 필요하다고 생각했으며,
정산 도메인을 시작으로 도메인 정리를 해나아가고 있습니다. 

## 왜 정산일까
첫 도메인 정리를 정산 도메인으로 한 이유는 정산 도메인에 여러가지 문제가 있었기 때문입니다.

첫째, `코드의 복잡성`이 매우 높았습니다. 정산 코드를 완전히 이해하는 서버 개발자가 없었으며, 약 2년간 코드가 방치되었습니다.
그래서 정산 관련 디버깅을 하거나 새로운 정책을 추가할 경우 어려웠습니다. <br/>
둘째, 그래서 더 큰 `기능을 추가하는 데에 어려움`이 있었습니다. 정산 자동화 기능을 인터널 팀에서 개발을 진행하려고 했으나, 정산의
주요 로직이 블랙박스였기 때문에 어떠한 문제가 생길지 가늠하기 어려웠습니다. <br/>
셋째, `도메인 전문가가 명확`했으며, 개발자와의 `커뮤니케이션에 어려움`을 느끼고 계셨습니다. 정산 담당자 분들이 사용하시는 언어와 개발자가 사용하는 언어가 달랐으며,
이해하고 있는 정산의 흐름 또한 달랐습니다. 문제점이 명확했기 때문에 도메인 주도 설계를 시도하기 적합하다고 생각했습니다.

위와 같은 이유로 정산 도메인을 첫 도메인 정리 대상으로 정하게 되었습니다.

## 기존 설계, 모델, 구현 파악하기
### 구현 파악하기
정산 도메인의 가장 큰 문제는, 코드 구현과 도메인 지식을 모두 알고 있는 사람이 없다는 것이었습니다.
하지만 새로운 모델을 정의하고 해당 모델을 기준으로 적합하게 구현하기 위해서는 기존 코드 파악을 매우 세밀하게 할 필요가 있었습니다. 
그래서 정산 관련 코드의 모든 필드 하나하나를 파악하고 정산 관련 업무를 하셨던 다양한 직군의 구성원과 논의하기를 반복하여 흩어진 지식을 모으게 되었습니다. 

<div style="margin-top: 10px; display: flex; justify-content: center; width: 100%">
  <div style="max-width: 249px; width: 50%;">
    <img src="./understand-previous-model.jpg" alt="understand-settlement-code" />
  </div>
  <div style="margin-left: 4px; max-width: 249px; width: 50%;">
    <img src="./understand-previous-model-2.jpg" alt="understand-settlement-code-2" />
  </div>
</div>
<figcaption>기존 정산 코드와 도메인을 이해하기 위한 노력들</figcaption>

### 모델 도출
도메인 지식을 모으고 정리하면서 정산의 핵심 기능을 완전히 파악할 수 있었고, 기존에 정의되어 있지 않던 모델을 코드 구현에서 도출해낼 수 있었습니다.
기존 구현에 대한 모델을 도출한 이유는, 새로운 모델을 만들기 위해서 기존 모델에서의 문제점을 정확히 분석할 수 있도록 
핵심과 흐름을 한 눈에 파악할 수 있어야 했기 때문입니다.
<div style="margin-top: 10px; display: flex; justify-content: center; width: 100%">
  <div style="margin-left: 4px; max-width: 500px; width: 100%;">
    <img src="./previous-model.png" alt="previous-model" />
  </div>
</div>
<figcaption>기존 정산 모델 도출</figcaption>

기존 구현에 대한 모델을 그리고 나니 문제점과 핵심이 한 눈에 보이기 시작했습니다. 가장 큰 문제는 객체의 역할이 명확하지 않다는 점입니다.

### 문제의 원인 - 타다 정산 도메인의 복잡성

문제를 더 자세히 살펴보기 전, 타다 정산 도메인에 대한 간략한 이해가 필요합니다.</br> 

1. 총 이용 금액은 운임료, 탄력요금, 호출예약비 등 `여러 항목`으로 **구성**됩니다. (요금 항목)
2. 이용 금액은 할인에 따라 `이용자`와 `VCNC`가 **부담**합니다. (누가 지불하는지)
3. 총 이용 금액 중 일부는 플랫폼 수수료로 `VCNC`에게 분배되고, 나머지는 `드라이버`에게 **분배**됩니다. (누구에게 분배하는지)
<br/>

여기서 요금을 분류하는 기준이 1.요금 항목 2.누가 3.누구에게 로 3가지인 것을 알 수 있습니다. 
정책에 따라 이 세 기준 중 어떤 기준을 사용하여 수수료 등을 계산할 것인지 달라지기 때문에, 구현에서의 복잡도를 매우 올리는 이유가 되고 있었습니다.  

하지만, 정산에서 결국 중요한 것은 이 모든 계산 과정을 거친 뒤 `누가 누구에게` 얼마를 지불해야하는지입니다.

### 문제점 - 책임의 잘못된 분리
기존 모델의 구성요소 중 가장 중요한 객체인 SettlementEntry와 SettlementContract의 역할은 다음과 같습니다. <br/>
`SettlementEntry`: 요금 항목과 `누가`를 기준으로 나눈 요금 <br/>
`SettlementContract`: SettlementEntry를 통해 `누구에게`를 기준으로 나눈 요금

그렇다면 SettlementEntry과 SettlementContract의 역할을 나눌 필요가 있을까요?

정산의 핵심은 `누가, 누구에게` 얼마를 주는지 결정하고 분배하는 것입니다. 하지만, SettlementEntry는 요금 항목과 `누가`를 기준으로 나눈 금액이고,
SettlementContract에서는 `누구에게`를 기준으로 분배할 금액을 결정해줍니다. 우리가 필요한 `누가 누구에게`의 책임이 **서로 다른 객체에 분리**되어 있는 셈입니다.

이렇다보니, SettlementEntry와 SettlementContract가 생성된 뒤에도 두 객체가 정산 프로세스 전체에 거쳐 사용되고 있으며, `누가 누구에게`의 책임을 담당하는
SettlementDetails라는 새로운 객체를 만들어 처리하고 있습니다.  
SettlementEntry와 SettlementContract는 연산의 중간 산물임에도 불구하고 너무 많은 곳에서 무분별하게 사용되고 있었습니다.

따라서 `누가, 누구에게`를 기준으로 금액을 나누는 책임을 **단일한** 객체를 만들 필요가 있다고 생각했습니다.

## 새 모델 정의하기
그래서 `누가 누구에게`얼마를 내야하는지를 정하는 객체를 중심으로 정산 도메인 모델을 다시 설계 했습니다.

<div style="margin-top: 10px; display: flex; justify-content: center; width: 100%">
  <div style="margin-left: 4px; max-width: 249px; width: 35% ;">
    <img src="./settlement_model_new_flow.png" alt="new-model" />
  </div>
</div>
<figcaption>새 모델의 전체 흐름</figcaption>

주요 구성요소는 SettlementDivision과 SettlementDistribution입니다.

### 모델 구성요소 - SettlementDivision, SettlementDistribution

<div style="margin-top: 10px; display: flex; justify-content: center; width: 100%">
  <div style="margin-left: 4px; max-width: 500px; width: 100%;">
    <img src="./settlement_model_new_division.png" alt="new-model" />
  </div>
</div>
<figcaption>새 모델의 SettlementDivision</figcaption>

`SettlementDistribution`을 만들기 이전에 우리가 알고 있는 정보는 유저와 VCNC가 내야하는 총 요금, 각 요금 항목마다
플랫폼 수수료 비율 등의 정보입니다. 계산에 사용되는 값들이 종류마다 다르기 때문에 이 정보들로 바로 `SettlementDistribution`을 생성하기에는
구현의 복잡도가 매우 올라갈 것으로 예상되었습니다. 세 기준인으로 나눈 금액인 `SettlementDivision`을 계산하고,
다시 합치는 방식으로 `SettlementDistribution`을 도출하기로 했습니다.

<div style="margin-top: 10px; display: flex; justify-content: center; width: 100%">
  <div style="margin-left: 4px; max-width: 500px; width: 100%;">
    <img src="./settlement_model_new_distribution.png" alt="new-model" />
  </div>
</div>
<figcaption>새 모델의 SettlementDistribution</figcaption>

`SettlementDistribution`은 핵심 데이터로서 `누가 누구`에게 얼마를 주어야하는지 정보를 가진 데이터입니다.
`SettlementDistribution`을 통해 누가 누구에게 얼마를 주어야하는지 정산 대행사에 요청할 객체를 만듭니다.

## 정산 전문가와 논의
타다 서버팀은 DDD의 핵심은 모델을 중심으로 도메인 전문가와 개발자가 긴밀하게 협업하는 것이라고 생각했습니다. 
그래서 서버팀만 알고 있는 모델을 만드는 것은 반쪽짜리 DDD라고 생각했고, 실제 정산 업무를 담당하시는 분들과 여러번의 논의를 거치며 모델을 다듬어갔습니다.

논의가 진행됨에 따라 `division으로 금액 나누기 -> distriubtion 기준으로 합치기 -> 정산 요청하기`의 큰 흐름은 바뀌지 않았지만, 세부 구현에 있어 매우 많은
인사이트를 얻을 수 있었습니다.

논의 과정에서 파악한 문제 중 하나를 살펴보려고 합니다.

### 사용하지 않으나 구현을 복잡하게 하는 것

실제 정산 담당자분들이 사용하지 않고 개념상으로도 필요하지 않지만, 코드를 복잡하게 하는 것들을 확인하고 제거할 수 있었습니다.

`PaymentType`은 enum 값으로, 요금 항목에 대한 돈을 누가 내는지 나타내고 있었습니다. 해당 enum에는 `CARD`, `CASH`, `VCNC`의 세 항목이 있었습니다.

이 enum에는 두 가지 문제가 있었습니다. 첫째, `이름이 모호`합니다. `CASH`는 유저가 내야하지만 내지 않아 VCNC의 예치금에서 빠져나가는 미수금을 가리키고 있었습니다. PaymentType.CASH라는 이름으로
이것을 유추하기는 불가능합니다. 둘째, 이 enum은 단순히 `누가`를 가리키는 것이 아니라, 청구된 대상과 실제 돈을 내는 대상을 합친 `복합적인 의미`를 갖고 있습니다. </br>

두 문제는 엮여있는 문제였으며, 특히 두번째가 더 큰 문제를 야기했습니다. 같은 enum을 다른 의미를 사용하는 코드가 뒤엉켜 몇 번을 읽어야 이해가 되는 코드를 만들어냈습니다.

두 의미를 한번에 내포해야 했던 이유는 이용자가 돈을 내지 않아 미수금이 발생할 경우 VCNC가 먼저 지불하고 나중에 이용자에게 돈을 받아야하기 때문입니다.
하지만, 실제 정산 업무에서는 해당 `paymentType`을 통해 미수금 여부를 판단하지 **않고** 있다는 것을 알게 되었고, `paymentType`이 원래 청구된 대상을 기준을 고려할 필요가 없다는 결론을 내게 되었습니다.
그래서 단순히 `누가`의 의미를 나타내는 `paySourceType`으로 `paymentType`을 대체했고 코드의 복잡도가 훨씬 줄어들 수 있었습니다.

이 예시를 통해 기획/설계 - 모델 - 구현이 매우 밀접하게 연관되어 있고, 구현상의 복잡도를 기획과 설계 단계에서 해결할 수 있다는 것을 깨달았습니다.
정산 담당자분들과 몇 차례의 논의를 거쳐 모델을 수정하고 해당 모델을 기준으로 코드를 구현하였습니다.

## 새 모델을 통한 구현
기존 코드와 새 모델으로 구현한 코드를 비교해보려고 합니다.
아래의 코드는 모두 실제 타다 서버의 코드입니다.

### 기존 정산 메인 함수
<div style="margin-top: 10px; display: flex; flex-direction: column; align-items: center; width: 100%">
  <div style="max-width: 500px; width: 100%;">
    <img src="./previous-code-1.png" alt="previous-code-1" />
  </div>
  <div style="max-width: 500px; width: 100%;">
    <img src="./previous-code-2.png" alt="previous-code-2" />
  </div>
  <div style="max-width: 500px; width: 100%;">
    <img src="./previous-code-3.png" alt="previous-code-3" />
  </div>
  <div style="max-width: 500px; width: 100%;">
    <img src="./previous-code-4.png" alt="previous-code-4" />
  </div>
</div>
<figcaption>기존 코드 일부</figcaption>

### 새 정산 메인 함수
```kotlin
fun settle(ride: Ride, payment: Payment?, paymentExtraType: PaymentExtraType?, isAmended: Boolean?) {
    val settlementAgency = TaxiSettlementAgency.get(ride)

    if (isSettlementNotNeeded(ride, payment, paymentExtraType, isAmended, settlementAgency)) {
        return
    }

    val divisions = divisionService.getSettlementDivision(ride, payment)
    val distributions = divisions.toDistribution()
    if (distributions.isSettlementNotNeeded()) return

    val paySources = paySourceService.getPaySources(payment, ride.driver!!)
    val receiverLicenses = receiverLicenseService.getReceiverLicenses(ride, payment)
    val rideInfo = settlementRideInfoService.getSettlementRideInfo(ride, payment)

    when (settlementAgency) {
        TaxiSettlementAgency.TMONEY -> tmoneyService.settleRide(distributions, paySources, receiverLicenses, rideInfo)
        ... // 정산 대행사에 따라 요청
    }
}
```