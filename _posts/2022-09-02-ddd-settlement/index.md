---
layout: post
date: 2022-09-02 10:00:00 +09:00
permalink: /2022-09-02-ddd-settlement

title: '정산 도메인 정리하기'
thumbnail:
- color: ./thumbnail-color.png
  gray: ./thumbnail-gray.png
  description: React 환경에서 Redux를 다루면서 겪었던 경험을 공유합니다.

tags: ['DDD', '정산', '리팩토링']

authors:
  - name: 'Lauv Cho
    comment: 성장에 목말라 있는 주니어 서버 개발자입니다.
    profileImage: './profile-image-lauv.jpeg'
    link: https://github.com/ko-ing
---

흐름:

// 
계기 등
시작한 방법
도메인 강결합, 도메인 내부에서도 정리가 되어있지 않은 문제 -> 규칙이 없다.
도메인 분리하는 건 시간이 오래걸리고 더 복잡한 문제다 -> 도메인 경계가 그나마 명확한 부분부터 정리하자
-> 정산: 누구나 코드 보기 힘들어함, 도메인 전문가가 명확, 도메인 전문가 - 개발자 소통 어려움
-> DDD 하기에 정산이 딱이다! 
DDD란?
//

## 기존 구현 파악하기
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
기존 구현에 대한 모델을 도출한 이유는, 새로운 모델을 만들기 위해서 기존 모델에서의 문제점을 정확히 파악할 필요가 있었으며 
핵심과 흐름을 한 눈에 파악할 수 있어야 했기 때문입니다.  

<div style="margin-top: 10px; display: flex; justify-content: center; width: 100%">
  <div style="margin-left: 4px; max-width: 249px; width: 50%;">
    <img src="./previoius-model.png" alt="previous-model" />
  </div>
</div>
<figcaption>기존 정산 모델 도출</figcaption>

### 문제점
기존 구현에 대한 모델을 그리고 나니 문제점과 핵심이 한 눈에 보이기 시작했습니다. 가장 큰 문제는 서비스와 데이터의 역할이 명확하지 않다는 점입니다.

문제를 더 자세히 살펴보기 전, 타다 정산 도메인에 대한 간략한 이해가 필요합니다.</br> 
운행이 완료되면 사용자에게 운행 요금이 부과됩니다. 보통 이때 부과된 요금은 기본 운임료, 탄력요금, 톨게이트비 등 여러 요금 항목으로 나뉘게 됩니다. </br> 
할인이 적용되는 운행의 경우에는 드라이버에게 분배되는 금액을 보존해야하고 사용자에게 부담되는 금액을 덜어야하기 때문에 해당 금액만큼 VCNC에서 부담하게 됩니다.
또한, 요금 항목 마다 드라이버에게 부과되는 플랫폼 수수료를 따로 계산하여 VCNC로 정산해야합니다.

정리하자면 다음과 같습니다.
1. 총 이용 금액은 여러 항목으로 구성된다. 
2. 이용 금액은 할인에 따라 이용자와 VCNC가 부담한다. 
3. 총 이용 금액 중 일부는 플랫폼 수수료로 VCNC에게 분배되고, 나머지는 드라이버에게 분배된다.
<br/>

[comment]: <> (dimension 단어 고치기)
여기서 요금을 분류하는 기준이 1.요금 항목, 2.부과 대상(누가) 3.분배 대상(누구에게)으로 3-dimension인 것을 알 수 있습니다.

이제 모델을 살펴봅시다. 
1. 1,2를 기준으로 요금을 나눈 것이 SettlementEntry이며, SettlementContract가 SettlementEntry를 가지고
SettlementRecord의 SettlementDetail을 만들 때 3을 기준으로 한 금액을 계산합니다. (제가 설명하고도 설명하기도 이해하기도 쉽지 않다고 느낍니다.) <br/>
2. SettlementRecord는 정산 관련 정보를 가지고 있는 엔티티이며, 해당 엔티티를 통해 SendSettlementInfoParams를 만듭니다. (저도 이상하고 생각합니다.) <br/>
3. SendSettlementInfoParams는 tmoney등의 정산대행사에 정산 요청을 할 때 보낼 정보를 담은 자료구조입니다.

그렇다면 SettlementEntry과 SettlementContract의 역할을 나눌 필요가 있을까요?
정산의 핵심은 "누가, 누구에게" 얼마를 주는지 결정하고 분배하는 것입니다. 하지만, SettlementEntry는 요금 항목과 "누가"를 기준으로 나눈 금액이고,
SettlementContract에서는 "누구에게"를 기준으로 나눈 금액을 결정해줍니다. 우리가 필요한 "누가, 누구에게"의 책임이 나누어져 있는 셈입니다.
따라서 "누가, 누구에게"를 기준으로 금액을 나누는 책임을 단일한 객체가 필요하다고 생각했습니다.

[comment]: <> (이미지 하나로 합치기, SettlementEntry, SettlementContract, SettlementDetails - 책임분리 안 된 거 잘 보여주기)
<div style="margin-top: 10px; display: flex; flex-direction: column; justify-content: center; width: 100%">
  <div style="margin-left: 4px; max-width: 249px; width: 50%;">
    <img src="./previoius-code-1.png" alt="previous-code-1" />
  </div>
  <div style="margin-left: 4px; max-width: 249px; width: 50%;">
    <img src="./previoius-code-2.png" alt="previous-code-2" />
  </div>
  <div style="margin-left: 4px; max-width: 249px; width: 50%;">
    <img src="./previoius-code-3.png" alt="previous-code-3" />
  </div>
  <div style="margin-left: 4px; max-width: 249px; width: 50%;">
    <img src="./previoius-code-4.png" alt="previous-code-4" />
  </div>
</div>
<figcaption>기존 코드 구현</figcaption>

## 새 모델 만들기
## 정산 전문가와 회의
## 모델 재정비
## 구현

[comment]: <> (드라이버, 사용자 등의 용어 통일)