---
layout: post
date: 2016-12-28 10:00:00 +09:00
permalink: /2016-12-28-struggling-with-the-leap-second
disqusUrl: http://engineering.vcnc.co.kr/2016/12/struggling-with-the-leap-second/

title: '2012년에 비트윈 서버를 마비시켰던 윤초 이야기'
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
description:
  처음에는 듣기에도 생소한 윤초가 대수롭지 않게 보이지만, 2012년에 추가될때는 비트윈을 포함해 Reddit, LinkedIn 등 여러 인터넷 서비스에 장애를 일으켰었습니다.
  비트윈 개발팀은 윤초 문제에서 완전히 벗어나기 위해 노력을 했었고 최근에는 좀 더 쉬운 방법이 나오기도 했습니다.
  이 글에서는 윤초와 관련된 서버 운영 이슈와 그 해결방안에 대해 다루려고 합니다.

tags: ['윤초', 'Leap Smear', chrony", 'Leap Second', 'Public NTP', '장애', '버그']

authors:
  - name: 'James Lee'
    facebook: https://www.facebook.com/eincs
    twitter: https://twitter.com/eincs
    google: https://plus.google.com/u/0/117656116840561651263/posts
    link: http://eincs.com
---

**2016년 12월 31일에 [윤초][leapsecondwiki]가 [추가될 예정][2016leapsecond]** 입니다.
정확하게는 UTC 기준으로 2016년 12월 31일 자정에, 한국 시각으로는 2017년 1월 1일 오전 9시에 추가됩니다.
처음에는 듣기에도 생소한 윤초가 대수롭지 않게 보이지만,
**2012년에 추가될 때는 비트윈을 포함해 [Reddit, LinkedIn 등 여러 인터넷 서비스에 장애][leapsecondfault]** 를 일으켰습니다.
비트윈 개발팀은 윤초 문제에서 완전히 벗어나기 위해 노력을 했었고 최근에는 좀 더 쉬운 방법이 나오기도 했습니다.
이 글에서는 윤초와 관련된 서버 운영 이슈와 그 해결방안에 대해 다루려고 합니다.

## 윤초란 무엇인가?

**[윤초][leapsecondwiki]란 지구의 자전, 공전 속도를 기준으로 한 [평균 태양시][solartime]와
세슘 원자시계를 기준으로 하는 [세계 협정시][utc](UTC)와의 오차를 보정하기 위하여 추가하는 1초**입니다.
지구의 자전 속도는 불규칙적으로 조금씩 느려지고 있는데 이 때문에 오차가 발생하는 정도도 미리 예측할 수 없습니다.
오차 정도에 따라 [IERS][ierswiki]에서 윤초를 추가해 오차를 보정할지 말지 결정을 하게 되는데 일반적으로 윤초가 추가되기 6개월 전에 발표합니다.
만약 윤초가 추가된다면 UTC 기준으로 6월 30일 혹은 12월 31일 23시 59분 59초에서 다음날로 넘어가기 전에 추가됩니다.

![윤초 보정 그래프][leapsecondtime]

<figcaption>윤초는 59초 이후 60초로 표현된 1초가 하나 삽입되는 형태로 추가됩니다. 한국시간에서는 8시 59분 59초 다음에 추가됩니다. (출처=APNIC)</figcaption>

![윤초 추가 예시][leapseconddiff]

<figcaption>태양시와 협정시의 차이는 불규칙적으로 계속 발생합니다. 오차가 수직으로 보정된 부분이 윤초가 추가된 시점입니다. (출처=위키피디아)</figcaption>

## 2012년 윤초 관련 장애

글을 쓰는 시점으로부터 약 4년 반전, **2012년 7월 1일 오전 9시에 윤초로 인한 버그로 인해 비트윈 서비스 전체에 장애가 발생** 했습니다.
일요일 아침이었지만 이메일을 통한 장애 알람이 오자마자 급하게 서버에 접속해서 서버들의 상태를 확인했습니다.
모든 JVM 인스턴스가 CPU 사용률이 100%가 되어 어떤 요청도 처리하지 못하고 있었습니다.
비트윈 채팅 서버, HBase등 비트윈 시스템 중 상당 부분이 JVM을 이용하고 있었기에 전체 서비스 장애가 발생 했습니다.
처음에는 원인 파악이 어려웠지만, 얼마 후에 윤초 삽입과 관련된 리눅스 커널의 버그 때문이라는 사실을 파악하였습니다.
서버 재시작만으로 쉽게 문제를 해결할 수 있다는 사실을 알게 되었고 모든 JVM 인스턴스를 재시작하였습니다.
전체 서비스가 모두 정상으로 돌아온 시각은 오전 11시 30분이었습니다.

## 윤초 버그가 발생한 이유는?

리눅스에서는 윤초를 처리하기 위해 NTP를 이용합니다.
NTP를 통해 윤초 정보를 받아오고, 윤초를 추가해야하는 시각에 시스템 시간을 보정합니다.
그런데 **윤초를 보정하는 리눅스 코드에 버그** 가 있었습니다.
저장된 윤초 정보를 바탕으로 윤초가 보정된 시각을 리턴하게 되는데, 이때 **[윤초 보정을 위해 내부적으로 타이머를 사용][linuxkernalbug]** 하게 되어있었습니다.
윤초 보정을 위해 **타이머를 사용하는 코드가 호출되면 [라이브락을 일으키는 버그][serverfault]** 가 있어서 [CPU를 100% 점유하는 것][livelockexplained]이었습니다.
**자바의 경우 Thread를 Parking하기 위한 코드에서 시간을 조회하게 되는데 이 부분에서 리눅스의 버그에 영향**을 받게 된 것입니다.
그래서 당시 문제가 있는 리눅스에서 돌아가던 JVM들이 이상 동작을 하게 되었고
비트윈 뿐만 아니라 [Reddit][redditstatus], LinkedIn 등 여러 서비스가 장애를 맞게 된 것입니다.
즉, 윤초에 의한 장애는 [간단해 보이지만 자그마치 NTP, 리눅스 커널, JVM의 세 가지 기술이 합쳐진 컴비네이션][lotcombination]입니다.

## 이 버그들이 지금은 고쳐졌나요?

현재 최신 리눅스 커널과 JVM에는 이와 같은 문제가 모두 고쳐졌습니다.
**리눅스 커널 3.2.14버전 혹은 3.4버전 이후에는 [윤초 보정을 위해 더 이상 타이머를 사용하지 않게][linuxkernalsolution]** 되었습니다.
**[JDK-6900441][javasolution]가 적용된 JDK7u60 이후나 모든 JDK8에서는 이와 같은 영향을 받지 않게** 됩니다.
장애가 났던 2012년 7월 1일 당시 비트윈 시스템은 Ubuntu 12.04와 JDK7 사용하고 있었습니다.
당시의 최신 버전 [Ubuntu][ubuntureleasedate]와 [JDK][jdkreleasedate]에는 이와 같은 패치가 적용되기 전이었습니다.
그래서 당시 최신 버전의 리눅스나 JDK를 사용하고 있었던 여러 인터넷 서비스들이 윤초 버그에 노출될 수밖에 없었습니다.
만약 현재 운영되는 시스템이 위와 같은 패치가 적용되지 않은 상태에서 NTP를 이용해 윤초 정보를 받아오고 있다면 똑같은 문제를 겪을 수 있습니다.
또한, 이와 같은 윤초와 관련된 버그는 실수에 의해 언제든지 다시 발생할 수 있으므로 항상 주의를 기울여야 합니다.

## 비트윈 개발팀의 해결책

일단 당시 장애가 발생했을 때는 빠른 해결을 위해 재시작을 했지만, 앞으로 윤초가 추가될 때마다 장애를 맞이할 수는 없는 일이었습니다.
비록 리눅스에 윤초와 관련된 버그를 고치는 패치가 적용되었지만, 혹시나 모를 새로운 윤초 버그에 대비할 방법이 필요했습니다.
이를 위해 여러 방면으로 찾던 중 **구글에서 윤초를 해결한 방법인 [Leap Smear][googleleapsmear]** 에 대해 알게 되었습니다.
Leap Smear는 **윤초가 추가될 때 1초를 명시적으로 추가하는 것이 아니라 1초를 여러 밀리세컨드로 나누어 몇 시간에 걸쳐서 천천히 보정하는 방법**입니다.
구현에 따라서 어느 길이의 시간에 걸쳐서 어떤 식으로 시간을 추가 할지 다를 수 있습니다.
이를 통해 시스템에 미치는 영향을 최소화하면서도 윤초에 대해 처리를 할 수 있습니다.

![Leap Smeared 예시][smearedtime]

<figcaption>구글 Public NTP에서 Leap Smear는 10시간에 걸쳐서 천천히 윤초를 반영합니다. (출처=구글)</figcaption>

2015년 6월 30일에 윤초가 추가될 것으로 발표된 후, 비트윈 개발팀은 이에 대응하기 위해 Leap Smear를 적용할 방법을 찾아보았습니다.
NTP를 대체하기 위해 만들어진 프로젝트인 **[chrony]에 Leap Smear 기능이 들어간 것을 알게 되었고 이를 비트윈 시스템에 적용**하였습니다.
지금은 NTP에도 윤초를 leap smear으로 처리하도록 설정할 수 있지만 당시에는 그렇지 않았습니다.
비트윈 시스템 인프라에 **chrony를 설치한 시간 서버 여러 대를 구성**하였습니다.
그리고 **다른 서버에는 NTP를 설치하여 chrony가 설치된 시간 서버를 통해 시간 동기화를 하도록 설정**하였습니다.
각 서버들은 시간 동기화 주기를 1분 간격으로 짧게 유지하여 Leap Smear가 적용되도록 한 것입니다.
이것과 관하여 [레드햇에서 쓴 포스트에 실린 그래프][fivewaystohandleleapseconds]를 살펴보면 잘 적용된다는 사실을 알 수 있습니다.
[비트윈의 모든 서버는 Ansible을 통해 프로비저닝][ansibledeploy] 되므로
Ansible 파일을 약간 고쳐 모든 서버를 다시 배포하기만 하면 변경된 시간 동기화 설정을 적용할 수 있었습니다.

## 아쉬웠던 점

당시 비트윈 개발팀은 윤초에 대해 몰랐지만, 관심을 기울였다면 윤초가 문제가 될 수도 있다는 것을 미리 알 수도 있었습니다.
[구글은 Leap Smear를 적용한지 오래][googleleapsmear]였고 리눅스의 [윤초 버그 또한 이미 패치가 올라온 상태][linuxkernalbugmailing]였습니다.
윤초 장애 며칠 전에도 [시스템에 문제를 발생 시킬수 있다는 글][scientificleapsecond]이 올라오기도 했습니다.
이에 대해 미리 알았다면, NTP에서 윤초 정보를 삭제하고, 윤초가 지나갈 때까지 시간 동기화를 일시정지하는 방법으로 서버 장애를 피할 수 있었습니다.
서비스를 안정적으로 운영하기 위해서는 **단순히 개발을 잘하는 것이 전부가 아니라 서버 운영상의 문제를 미리 알 수 있도록
다양한 뉴스에 귀를 기울이고 적절한 조치를 미리 취할 수 있어야 한다는 생각**을 가지게 되었습니다.

## 윤초를 피하기 위한 여러 기술들

비트윈은 윤초 문제를 피하기 위해 Leap Smear를 적용하기위해 [chrony]를 이용하여 시간 서버를 구축했습니다. 그러나 이제는 더 쉬운 방법이 많아졌습니다.
최근 **구글에서 [Public NTP][googlepublicntp]를 공식적으로 공개**하였고 Public NTP에서는 [Leap Smear를 지원][googlepublicntpleapsmear]합니다.
이를 이용하면 따로 시간 서버를 구축 할 필요 없이 [쉽게 Leap Smear를 적용][googlepublicntpconfig]할 수 있게 되었습니다.
AWS에서도 Leap Smear를 적용한 [AWS Adjusted Time][amazonleapsecondsolution]을 적용하였고
[Microsoft][microsoftleapsecondsolution]나 [Akamai][akamaileapsecondsolution]도 Leap Smear를 지원합니다.
이제는 클라우드 서비스 제공자가 윤초를 피해가기 위한 쉬운 방법을 제공해주거나 쉽게 Leap Smear를 피해가는 방법들이 많아졌습니다.

## 정리

윤초는 사소해보이지만 2012년에는 많은 서비스에 장애를 낸 이력이 있습니다.
**서비스를 안정적으로 운영하기 위해서는 개발 뿐만 아니라 이런 뉴스에도 귀를 기울이고 적절하게 대처**를 할 수 있어야 합니다.
비트윈 개발팀은 윤초 문제에 대응하기위해 [chrony]를 이용해 [Leap Smear][googleleapsmear]가 적용된 시간 서버를 운영하였습니다.
최근에는 윤초를 문제를 피해가기 위한 쉬운 방법들이 많이 공개되었는데,
특히 **구글의 [Public NTP][googlepublicntp]를 이용하면 약간의 NTP 설정 수정만으로 Leap Smear를 적용**할 수 있습니다.

[leapsecondwiki]: https://ko.wikipedia.org/wiki/%EC%9C%A4%EC%B4%88
[2016leapsecond]: https://datacenter.iers.org/web/guest/eop/-/somos/5Rgv/latest/16
[leapsecondfault]: https://www.wired.com/2012/07/leap-second-bug-wreaks-havoc-with-java-linux/
[utc]: https://ko.wikipedia.org/wiki/%ED%98%91%EC%A0%95_%EC%84%B8%EA%B3%84%EC%8B%9C
[solartime]: https://ko.wikipedia.org/wiki/%ED%83%9C%EC%96%91%EC%8B%9C
[linuxkernalbug]: https://github.com/torvalds/linux/commit/7dffa3c673fbcf835cd7be80bb4aec8ad3f51168
[linuxkernalsolution]: https://github.com/torvalds/linux/commit/6b43ae8a619d17c4935c3320d2ef9e92bdeed05d
[javasolution]: https://bugs.openjdk.java.net/browse/JDK-6900441
[datastxexplained]: http://www.datastax.com/dev/blog/preparing-for-the-leap-second-2017
[googleleapsmear]: https://googleblog.blogspot.kr/2011/09/time-technology-and-leaping-seconds.html
[chrony]: https://chrony.tuxfamily.org/
[googlepublicntp]: https://developers.google.com/time/smear
[googlepublicntpleapsmear]: https://developers.google.com/time/smear
[googlepublicntpconfig]: https://developers.google.com/time/guides#linux_ntpd
[iers]: http://www.iers.org/
[ierswiki]: https://en.wikipedia.org/wiki/International_Earth_Rotation_and_Reference_Systems_Service
[fivewaystohandleleapseconds]: https://developers.redhat.com/blog/2015/06/01/five-different-ways-handle-leap-seconds-ntp/
[googlepublicntpannounce]: https://cloudplatform.googleblog.com/2016/11/making-every-leap-second-count-with-our-new-public-NTP-servers.html
[amazonleapsecondsolution]: https://aws.amazon.com/ko/blogs/aws/look-before-you-leap-december-31-2016-leap-second-on-aws/
[microsoftleapsecondsolution]: http://www.theregister.co.uk/2015/05/29/windows_azure_second_out_of_sync/
[akamaileapsecondsolution]: https://blogs.akamai.com/2016/11/planning-for-the-end-of-2016-a-leap-second-and-the-end-of-support-for-sha-1-tls-certificates.html
[jdkreleasedate]: https://java.com/en/download/faq/release_dates.xml
[ubuntureleasedate]: https://wiki.ubuntu.com/Kernel/Support#A12.04.x_Ubuntu_Kernel_Support
[linuxkernalbugmailing]: http://lkml.iu.edu/hypermail/linux/kernel/1203.1/04598.html
[serverfault]: http://serverfault.com/a/403767
[redditstatus]: https://twitter.com/redditstatus/status/219244389044731904
[lotcombination]: https://namu.wiki/w/%EB%A1%AF(%EB%8D%B4%EB%A7%88)#s-4
[ansibledeploy]: https://speakerdeck.com/vcnc/ansiblegwa-cloudformationeul-iyonghan-baepo-jadonghwa
[livelockexplained]: https://www.reddit.com/r/programming/comments/vxmf7/time_arithmetic_you_win_again/c58lkmx/
[scientificleapsecond]: http://scientificlinuxforum.org/index.php?showtopic=1695
[leapseconddiff]: ./leapseconddiff.png
[leapsecondtime]: ./leapsecondtime.png
[smearedtime]: ./googlesmearedtime.png
