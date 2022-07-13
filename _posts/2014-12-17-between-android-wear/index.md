---
layout: post
date: 2014-12-17 10:00:00 +09:00
permalink: /2014-12-17-between-android-wear
disqusUrl: http://engineering.vcnc.co.kr/2014/12/between-android-wear/

title: 'Android Wear 개발하기'
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
description:
  비트윈 팀은 지난달 비트윈에 Android Wear 앱 기능을 릴리즈했습니다. 즐거운 개발 경험이었지만, 힘들었던 점도 많았습니다.
  어떤 과정을 통해서 개발하게 되었고, 내부 구조는 어떻게 되어 있는지, 신경 쓰거나 조심해야 할 점은 어떤 것들이 있는지 저희의 경험을 공유해보려고 합니다.
  이 글을 통해 Android Wear 앱 제작을 고민하는 개발자나 팀이 더 나은 선택을 하는 데 도움이 되고자 합니다.

tags: ['Android Wear', '안드로이드 웨어', 'Wearable', '웨어러블']

authors:
  - name: 'Kevin Kim'
    facebook: https://www.facebook.com/sangwookim.me
    link: https://www.facebook.com/sangwookim.me
---

비트윈 팀은 지난달 비트윈에 Android Wear 앱 기능을 릴리즈했습니다. 즐거운 개발 경험이었지만, 힘들었던 점도 많았습니다.
어떤 과정을 통해서 개발하게 되었고, 내부 구조는 어떻게 되어 있는지, 신경 쓰거나 조심해야 할 점은 어떤 것들이 있는지 저희의 경험을 공유해보려고 합니다.
이 글을 통해 Android Wear 앱 제작을 고민하는 개발자나 팀이 더 나은 선택을 하는 데 도움이 되고자 합니다.

## Android Wear에 대해

[Android Wear]는 최근 발표된 구글의 새 웨어러블 플랫폼입니다. 공개된 지 얼마 되지 않았음에도 불구하고 완성도 있는 디바이스들이 출시된 상태이며,
기존의 웨어러블 기기보다 기능과 가격이 매력 있다는 평가를 받고 있습니다. 또한, 2014 Google I/O에서 크게 소개되고 시계를 참가자들에게 나눠주는 등,
구글에서 강하게 밀어주고 있기 때문에 상당히 기대되는 플랫폼입니다.

Android Wear의 알림 기능은 연결된 mobile[^1] 기기와 연동됩니다.
예를 들어 메시지를 받았을 때 mobile과 wear에서 모두 알림을 받아볼 수 있고, Google Now와 연동하여 교통, 날씨 등 상황에 맞는 알림을 제공합니다.

또, 여러 가지 앱들의 다양한 기능을 음성으로 제어하도록 하여 사용자에게 기존의 시계와는 완전히 다른 경험을 주고 있습니다.

한국에서는 [Google Play Store의 기기 섹션]에서 구매가 가능합니다.

## Android Wear 개발하기

Android Wear는 Android 플랫폼을 거의 그대로 사용하기 때문에, Android 개발 경험이 있는 개발자라면 아주 쉽게 개발을 시작할 수 있습니다.
비트윈에서는 구글의 80:20 프로젝트를 패러디한 **100+20 프로젝트**를 통해 개발을 진행하게 되었습니다.
(하던 일을 다 해내면서 시간을 내어 진행한다는 의미로 100+20 프로젝트입니다. 하지만 가끔은 '20' 부분에 너무 몰입하여 0+20이 되기도 한다는 게 함정입니다...)

Activity, Service 등 Android의 기본 component들을 모두 그대로 사용 가능하며,
손목에 찰 수 있는 크기의 화면에서 유용하게 사용할 수 있는 WearableListView, GridViewPager 같은 새 widget들이 추가되었습니다.
구글 개발자 사이트의 [wearable training 섹션]에서 자세한 안내를 볼 수 있습니다.

## 비트윈의 아이디어

비트윈 Android Wear 기능의 컨셉은, 항상 몸에 착용하는 Wear의 특징을 살려, '커플이 떨어져 있더라도, 항상 함께 있는 느낌을 주기' 였습니다.
그래서 아래와 같은 기능들이 기획되었습니다.

- **Feel His/Her Heart (그대의 심장박동 느끼기)**: 상대방의 심장박동을 진동으로 재현해주기
- **Where He/She Is (그/그녀는 어느 방향에 있을까?)**: 상대방의 위치를 나침반과 같은 형태로 보여주기 (안심하세요. 여러분. 방향만 알려주고 정확한 위치는 알려주지 않습니다!)
- **Feel Memories (메모리박스)**: 언제든 추억을 떠올릴 수 있도록 비트윈의 기존 기능인 메모리박스(추억상자)를 Android Wear에서 구현

하지만 이 아이디어들은 하루 만에 망하게 됩니다.

메인 아이디어였던 **심장박동 느끼기**는 사용자가 요청하면 상대방의 시계에서 심장박동이 측정되어 사용자에게 상대방의 심장박동을 진동으로 재현해주는 멋진 기능이었습니다.
하지만 이 아이디어를 낼 때 심박센서가 탑재된 Android Wear 기기가 없었던 게 함정이었습니다.

다음날 Android Wear Bootcamp에 참가하여 심박센서가 작동하는 삼성 Gear Live 기기를 사용해 볼 수 있었습니다. 결과는 충격이었습니다.
생각과는 달리 심박박동 측정 결과가 나오는데 10~20초가 걸리고, 그나마도 측정되는 동안은 올바른 위치에 시계를 차고 가만히 있어야 했습니다.
결국, 이러한 제약 때문에 사용자들이 실제로 유용하게 사용할 수 있는 기능이 될 수 없었습니다.

그래서 계획을 수정하여 현실적으로 구현 가능한 기능들을 먼저 만들어 보기로 했습니다.

- **목소리로 답변하기**: 상대방에게 온 메시지에 Android Wear Framework에서 제공하는 음성인식을 이용하여 목소리를 텍스트로 바꾸어서 답장하기

- **이모티콘 답변하기**: 이모티콘을 사용자가 선택하여 이모티콘으로 답장하기

- **비트윈 메모리박스**: 비트윈의 기존 기능인 메모리박스(추억상자)를 Android Wear에서 구현

처음의 원대한 계획에서 뭔가 많이 변경된 것 같지만, 기분 탓일 겁니다.

## 내부 구현

비트윈 Android Wear 앱은 크게 두 가지 기능을 가지고 있습니다.
하나는 상대방에게 메시지를 받았을 때, 메시지 내용을 확인하고 여러 가지 형태로 답장할 수 있는 Notification 기능이고,
다른 하나는 Wear에서 원래 Application의 일부 기능을 시작 메뉴를 통하거나 목소리로 실행시킬 수 있게 해주는 Micro App입니다.
해당 기능들의 스크린샷과 함께 내부 구조를 설명하겠습니다.

우선 **Notification** 부분입니다. 앱 개발사에서 아무 작업도 하지 않더라도, 기본적으로 Android Wear Framework이 스크린샷 윗줄 첫 번째, 네 번째 화면과 같이 예쁜 알림화면과 Open on phone 버튼을 만들어 줍니다.
여기에 추가적인 기능을 붙이기 위하여 [WearableExtender]를 이용하여 목소리로 답장하기, 이모티콘 보내기 버튼을 덧붙였습니다.

![Notification][screenshot1]

<figcaption>비트윈 Android Wear 스크린샷 - Notification</figcaption>

둘째로는 **Micro App** 부분입니다. 여기에는 이모티콘 전송과 메모리박스를 넣었습니다. 이 부분은 일반적인 Android 앱을 만들듯이 작업할 수 있습니다

![Micro App][screenshot2]

<figcaption>비트윈 Android Wear 스크린샷 - Micro App</figcaption>

화면을 보면 무척 단순해 보이지만 내부 구조는 간단하지가 않습니다. 연결된 화면들을 만들어내는 코드가 한곳에 모여있지 않고, 각기 다른 곳에 있는 코드들을 연결하여야 하기 때문입니다.
Notification 하나를 만들 때에 Framework에서 만들어주는 1, 4번째 화면, Notification에 WearableExtender를 이용하여 덧붙이는 2, 3번째 화면, 그리고 다시 Framework에서 만들어주는 목소리로 답장하기 화면, 그리고 Wear 쪽의 Micro App을 통해 구동되는 이모티콘 선택 화면과 같이 여러 군데에 나누어 존재하는 코드가 연결됩니다.

![내부 구조][implementation1]

<figcaption>하나의 앱처럼 느껴지는 화면이지만 각각 다른 곳에 코드가 쓰여있습니다.</figcaption>

그러면 이번에는 각 화면이 어떻게 연결되는지 알아보겠습니다.

사용자가 상대방으로부터 받은 메시지를 Android Wear의 Notification으로 확인하고, 답장으로 이모티콘을 보내고자 하는 상황을 가정해 봅시다.
사용자가 Send Emoticon 버튼을 눌렀을 때 이모티콘 선택화면을 보여주고 싶은데, 이 행동에 대한 pending intent를 wear 쪽의 micro app이 아닌, mobile 쪽에서 받게 되어 있습니다.
이 때문에 아래의 표와 같이 mobile 쪽에서 pending intent를 받은 뒤 다시 wear 쪽으로 이모티콘 선택 화면을 보여주라는 메시지를 전송해줘야 합니다.

![Emoticon][implementation2]

<figcaption>이모티콘 전송 과정</figcaption>

이번에는 메모리박스를 보겠습니다. 메모리박스도 단순한 화면이지만 mobile 쪽과 통신하여 내용을 불러와야 하므로 생각보다 해야 하는 일이 많습니다.
Android Wear Message API와 Data API를 이용하여 데이터를 주고받아 사진을 화면에 보여줍니다.

![Memory Box][implementation3]

<figcaption>메모리박스를 보여주는 과정</figcaption>

## 개발 시 신경 써야 하는 점

개발하면서 주의 깊게 신경 써야 하는 점들이 있습니다.

**첫 번째로 코드 퀄리티입니다.**

Android Wear는 아직 성숙하지 않은 플랫폼이기 때문에 많은 사람이 받아들인 정형화된 패턴이 없습니다.
앞서 살펴보았듯이, 간단한 기능을 구현하려고 해도 상당히 복잡한 구조를 가진 앱을 만들게 되기에, 코드 퀄리티를 높게 유지하기 어려웠습니다

비트윈 팀에서는 [EventBus]를 활용하여 코드를 깔끔하게 유지하려고 노력하였습니다. 이러한 문제를 해결할 수 있는 [Guava]의 Concurrent 패키지나,
[RxJava] 등의 도구들이 있으니 익숙한 도구를 선택하여 진행하는 것을 추천합니다.
또한, 구글의 [Android Wear 코드랩] 튜토리얼의 내용이 매우 좋으니, 한번 처음부터 수행해 보면 좋은 코드를 만들 수 있는 아이디어가 많이 나올 것입니다.

**두 번째로는 원형 디바이스 지원 및 에러 처리입니다.**

처음부터 원형 디바이스를 신경 쓰지 않으면 마무리 작업 시 상당한 고통을 받게 됩니다.
원형 디바이스에 대한 대응법은 Android 개발자 트레이닝 사이트의 [wearable layout 섹션]에 자세히 나와 있습니다.
현재는 원형 디바이스를 처리하는 프레임웍에 약간 버그가 있지만, 곧 수정될 것으로 생각합니다.

사용자 입력이 있을 때, 그리고 에러가 났을 때 적절하게 처리해주는 것은 제품의 완성도에 있어 중요한 부분입니다.
Android Wear Framework에서 제공하는 [ConfirmationActivity]등을 활용하여 처리하면 됩니다.

**마지막으로 패키징입니다.**

자동 설치 패키징은 비트윈 팀에서도 가장 고생했던 부분입니다. Android Wear는 본체 앱을 설치하면 자동으로 함께 설치되는데,
앱이 정상작동하기 위해서는 몇 가지 까다로운 조건이 있습니다.

- build.gradle 의 applicationId 를 wear와 mobile 양쪽 모두 똑같이 맞춰야 합니다.
- Wear app의 AndroidManifest에 새롭게 선언한 permission이 있다면 mobile 쪽에도 포함해 주어야 합니다.
- 기본적으로, 똑같은 key로 서명합니다. 다른 key로 sign 하는 경우는 문서를 참고해서 신경 써서 합니다.

위 항목들은 아주 중요한 내용이지만 아직 문서화가 완벽하지 않으니 주의 깊게 진행해야 합니다.

## 후기

개발 과정에서 여러 가지 어려움이 있었지만, 무척 즐거웠던 프로젝트였습니다!

우선 새로운 플랫폼에서 새로운 제품의 아이디어를 내고 만들어내는 과정이 많은 영감과 즐거움을 주었습니다.

두 번째로는 Android Wear를 포함한 버전 출시 이후 구글플레이의 Android Wear 섹션 및 추천 앱 섹션에 올라가게 되어
홍보 효과도 얻을 수 있었습니다. 또한, 구글의 신기술을 적극적으로 사용하고자 하는 팀에게는 구글 쪽에서도 많은 지원을 해주기 때문에 도움도 많이 받았습니다.

세 번째로는 기존의 Android 개발과 비슷하여 접근하기 쉬우면서도, 원하는 것을 구현하려면 상당히 도전적이어서 재미있었습니다.

다만 조심해야 할 점은, 구글에서 적극적으로 밀고 있는 프로젝트라고 해서 다 성공하는 것은 아니라는 점입니다.
얼마만큼의 시간과 자원을 투자할지는 신중하게 생각하면 좋겠습니다.

## 정리

Android Wear는 새로운 기술과 플랫폼에 관심이 많은 개발자, 혹은 팀이라면 시간을 투자해서 해볼 만한 재미있는 프로젝트입니다.
하지만 완성도 있는 좋은 제품을 만들기 위해서는 생각보다 할 일이 많으니 이를 신중하게 고려하여 결정해야 합니다.

끝으로 2014 GDG Korea Android Conference에서 같은 주제로 발표하였던 슬라이드를 첨부합니다.

<script async class="speakerdeck-embed" data-id="a1415af04644013234cf7a3f7c519e69" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

[^1]: 구글의 튜토리얼 등에서 지칭하는 것과 마찬가지로, 이 글에서도 Android Wear와 연결된 휴대폰을 mobile이라 하겠습니다.

[android wear]: http://www.android.com/wear
[google play store의 기기 섹션]: https://play.google.com/store/devices
[wearable training 섹션]: https://developer.android.com/training/building-wearables.html
[wearable layout 섹션]: https://developer.android.com/training/wearables/ui/layouts.html#different-layouts
[android wear 코드랩]: http://goo.gl/Qu7wJG
[eventbus]: https://github.com/greenrobot/EventBus
[rxjava]: https://github.com/ReactiveX/RxAndroid
[guava]: https://code.google.com/p/guava-libraries
[wearableextender]: https://developer.android.com/reference/android/support/v4/app/NotificationCompat.WearableExtender.html
[confirmationactivity]: https://developer.android.com/training/wearables/ui/confirm.html
[screenshot1]: ./android-wear-screenshot1.png
[screenshot2]: ./android-wear-screenshot2.png
[implementation1]: ./android-wear-implementation1.png
[implementation2]: ./android-wear-implementation2.png
[implementation3]: ./android-wear-implementation3.png
