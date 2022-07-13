---
layout: post
date: 2015-11-30 13:00:00 +09:00
permalink: /2015-11-30-presenter-multitier-architecture
disqusUrl: http://engineering.vcnc.co.kr/2015/11/presenter-multitier-architecture/

title: '비트윈의 멀티티어 아키텍처를 위한 프레젠터 이야기'
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
description:
  비트윈 개발팀에서는 여러가지 필요성이 생겨 해당 역할을 담당하는 프레젠터라는 것을 만들게 되었고 비트윈의 시스템에 적용하게 되었습니다.
  만드는 과정 중에 여러 문제들이 있었고 이를 해결하기 위한 많은 노력을 하였으며, 이 글에서는 비트윈 시스템에서의 프레젠터에 대해 이야기 하고자 합니다.

tags: ['비트윈 서버', 'ELB', 'Architecture', 'Multiplexing Protocol', 'TCP Multiplexing']

authors:
  - name: 'James Lee'
    facebook: https://www.facebook.com/eincs
    twitter: https://twitter.com/eincs
    google: https://plus.google.com/u/0/117656116840561651263/posts
    link: http://eincs.com
---

블로그 첫 글에서 [비트윈의 시스템 아키텍처]에 대해 다룬 적이 있습니다. 시스템 구성의 미래에 대한 계획으로 [멀티티어 아키텍처]에 대해 언급했었는데,
이는 프로토콜을 단순화시키고 배포 자동화를 가능하게 하기 위해서 **클라이언트와 비즈니스 로직을 담당하는 서버 사이에 일종의 게이트웨이**를 두는 것이었습니다.
그 외에도 여러 가지 필요성이 생겨 해당 역할을 담당하는 프레젠터라는 것을 만들게 되었고 비트윈의 채팅 시스템에 적용하게 되었습니다.
만드는 과정 중에 여러 기술적인 문제들이 있었고 이를 해결하기 위한 노력을 하였습니다. 이 글에서는 비트윈 시스템에서의 프레젠터에 대해 이야기 하고자 합니다.

## 프레젠터

프레젠터는 일종의 게이트웨이 입니다. 기존의 시스템에서는 클라이언트들이 [ELB]를 통해 채팅 서버에 직접 TCP 연결을 하였습니다.
하지만 비트윈 PC버전과 자체 푸시 서버를 만들면서 [ELB]로는 해결할 수 없는 부족한 점들이 생겼고, ELB의 부족한 점을 채워줄 수 있는 시스템이 필요하게 되었습니다.
**ELB를 대체하는 역할 외에도 다른 여러 필요했던 기능들을 제공**하는 프레젠터를 만들기로 하였습니다.

![프레젠터 시스템][presenterarchitecture]

<figcaption>프레젠터는 ELB의 역할을 할 뿐만 아니라 여러 다른 기능들도 제공합니다.</figcaption>

## 프레젠터의 기능

### 패킷을 적절한 샤드로 중계

비트윈에서는 커플 단위로 샤딩하여 같은 커플의 채팅 요청에 대해서는 같은 채팅 서버에서 처리하고 있습니다.
[Consistent Hash]를 통해 커플을 여러 채팅 서버로 샤딩하고 [ZooKeeper]를 이용하여 이 정보를 여러 채팅 서버 간 공유합니다.
프레젠터 또한 ZooKeeper와 연결을 하여 **어떤 채팅 서버가 어떤 커플을 담당하는지에 대한 정보를 알고 있도록 설계**되어 있습니다.
따라서 프레젠터는 첫 연결 시 보내는 인증 패킷을 보고 해당 채팅 연결에서 오는 요청들을 어떤 채팅 서버로 보내야 할지 판단할 수 있습니다.
**어떤 채팅 서버로 보낼지 판단하는 과정은 처음 한 번만 일어나며, 이후 패킷부터는 자동으로 해당 채팅 서버로 중계**합니다.

프레젠터의 이런 기능 덕분에 클라이언트는 더 이상 어떤 채팅 서버로 붙어야 하는지 알아내는 과정 없이 아무 프레젠터와 연결만 맺으면 채팅을 할 수 있게 되었습니다.
기존에는 클라이언트들이 여러 채팅 서버 중 어떤 서버에 붙어야 하는지 확인하는 작업을 한 후에 할당된 채팅 서버로 연결 맺어야 했습니다.
그래서 클라이언트가 채팅 서버와 연결을 맺기 위해 다소 복잡한 과정을 거쳐야 했지만,
이제는 **클라이언트가 프레젠터의 주소로 연결 요청만 하면 [DNS Round Robin] 통해 아무 프레젠터와 연결하는 방식으로 프로토콜을 단순화**할 수 있었습니다.
덕분에 새로운 채팅 서버를 띄울 때마다 ELB를 Warm-Up 시켜야 했던 기존 시스템의 문제가 없어졌습니다.
그래서 비트윈 개발팀의 오랜 염원이었던 **채팅 서버 오토스케일의 가능성**도 열렸습니다.

### 많은 수의 연결을 안정적으로 유지

PC버전과 푸시 서버를 만들면서 **기존의 채팅 연결과 다르게 많은 수의 연결이 장시간 동안 유지 되는 경우를 처리할 수 있어야** 했습니다.
기존에는 TCP 릴레이를 하도록 설정된 ELB가 연결들을 받아주었습니다.
한 머신당 6만 개 정도의 Outbound TCP 연결을 맺을 수 있는데, ELB도 트래픽에 따라 여러 대의 머신에서 돌아가는 일종의 프로그램이므로 이 제한에 걸린다고 생각할 수 있습니다.
따라서 **많은 수의 연결을 맺어놓고 있어야 하는 경우 ELB에 문제가 생길 수 있다고 판단**했습니다. (과거 ELB가 연결 개수가 많아지는 경우 스케일아웃이 안되는 버그 때문에 문제가 된 적이 있기도 했습니다)
또한 **클라이어트 연결당 내부 연결도 하나씩 생겨야 하면 클라이언트가 연결을 끊거나 맺을 때마다 서버 내부 연결도 매번 끊거나 연결해야 하는 오버헤드가 발생**합니다.

이를 해결하기 위해 프레젠터에서는 **TCP 연결을 Multiplexing하는 프로토콜을 구현하여 적은 수의 내부 연결로 많은 수의 클라이언트 연결을 처리할 수 있도록** 하였습니다.
서버 내부에서는 고정된 개수의 몇 개의 연결만 맺어 놓고 이 연결들만으로 수많은 클라이언트 연결을 처리할 수 있습니다.
이처럼 TCP Multiplexing을 하는 것은 [Finagle과 같은 다른 RPC 프로젝트에서도 지원][finaglemux]하는 기능입니다.

![멀티플렉싱 프로토콜][multiplexingprotocol]

<figcaption>TCP Multiplexing 프로토콜을 통해 많은 수의 클라이언트 연결을 소수의 서버 내부 연결로 처리합니다.</figcaption>

또한, 프레젠터는 **많은 수의 SSL 연결을 처리해야 하므로 암복호화 로직을 실행하는데 퍼포먼스가 매우 중요**하게 됩니다.
채팅 서버 한 대를 제거하거나 하는 경우 많은 연결이 한꺼번에 끊어지고 연이어 한꺼번에 연결을 시도하게 되는 경우가 있을 수 있는데, 이 때 대량의 SSL Handshaking을 하게 됩니다.
기존 서버들로 대량의 SSL Handshaking을 빠른 시간안에 처리하기 위해서는 높은 퍼포먼스가 필요합니다.
Java로 작성된 프로그램만으로 이런 퍼포먼스 요구사항을 달성하기 어려우므로, **클라이언트와의 연결을 담당하는 부분은 [OpenSSL], [libevent]를 이용한 C++로 코드로 작성**하였습니다.
인증 패킷을 파싱하거나 패킷들을 릴레이 하는 등의 로직을 담당하는 부분은 Alfred라는 [Netty]를 이용하여 만든 인하우스 RPC 라이브러리를 이용해 작성되었습니다.
연결을 담당하는 부분은 TCP 연결을 유지하는 역할과 들어온 패킷들을 Netty로 작성된 모듈로 릴레이 하는 역할만 담당하므로 매우 간단한 형태의 프로그램입니다.
짧은 시간 안에 어럽지 않게 구현할 수 있었습니다.

![프레젠터 내부 구조][presentermodule]

<figcaption>클라이언트의 연결을 받아주는 역할을 하는 부분은 C++, 실제 로직이 필요한 부분은 Java로 작성하였습니다.</figcaption>

### 여러 네트워크 최적화 기술의 지원

ELB에는 여러 네트워크 최적화 기술들을 아직 제공하지 않는 경우가 있습니다. 대표적으로 [HTTP/2] 혹은 [SPDY], [QUIC], [TCP Fast Open] 등이 있습니다.
특히 **모바일 환경에서는 SSL Handshaking 등 부가적인 RTT로 인한 지연을 무시할 수 없으므로 이런 기술들을 이용한 초기 연결 시간 최적화는 서비스 퀄리티에 중요한 부분** 중 하나입니다.
ELB는 AWS에서 관리하는 서비스이므로 AWS에서 이런 기능들을 ELB에 적용하기 전에는 이용할 수 없지만, 프레젠터는 직접 운영하는 서버이므로 필요한 기능을 바로바로 적용하여 서비스 품질을 높일 수 있습니다.
ELB에서 이미 제공하는 최적화 기술인 [SSL Session Ticket]이나 다른 몇몇 기술은 이미 적용되어 있고 아직 적용하지 않은 기술들도 필요에 따라 차차 적용할 예정입니다.

## 프레젠터의 구현

### C++ 연결 유지 모듈

프레젠터는 퍼포먼스를 위해 **C++로 작성**되었습니다. 이는 **Pure Java를 이용한 암복호화는 프레젠터에서 원하는 정도의 퍼포먼스를 낼 수 없기 때문**입니다.
처음에는 [OpenSSL]과 [libevent]를 이용해 작성된 코드를 JNI를 통해 Netty 인터페이스에 붙인 event4j라는 인하우스 라이브러리를 이용하려고 했으나, 코드가 복잡하고 유지보수가 어렵다는 점 때문에 포기하였습니다.
그 후에는 [netty-tcnative]를 이용해보고자 했으나 테스트 결과 연결당 메모리 사용량이 큰 문제가 있었고, 이를 수정하기에는 시간이 오래 걸릴 것 같아 포기하였습니다.
결국, **페이스북에서 오픈소스로 공개한 C++ 라이브러리인 [folly]를 활용하여 프레젠터를 작성**하게 되었습니다. folly의 네트워크 API들이 OpenSSL과 libevent를 이용해 구현되어 있습니다.

### 릴레이 로직

프레젠터는 **첫 인증 패킷을 파싱하여 릴레이할 채팅 서버를 판단하며, 이후의 패킷부터는 실제 패킷을 까보지 않고 단순 릴레이 하도록 설계**하였습니다.
처음의 Netty 파이프라인에는 Alfred 프로토콜을 처리할 수 있는 핸들러들이 설정되어 있어 인증 패킷을 파싱 할 수 있으며 인증 패킷에 있는 정보를 바탕으로 어떤 채팅 서버로 패킷을 릴레이 할지 결정합니다.
그 이후 파이프라인에 있던 핸들러를 모두 제거 한 후, 읽은 byte 스트림을 Multiplexing Protocol 프레임으로 감싸서 그대로 릴레이 하는 매우 간단한 로직을 담당하는 핸들러 하나를 추가합니다.
덕분에 **로직 부분의 구현도 매우 간단해질 수 있었으며, 채팅 서버에 API가 추가되거나 변경되어도 프레젠터는 업데이트할 필요가 없다는 운영상 이점**도 있었습니다.

### Multiplexing Protocol

프레젠터의 **Multiplexing Protocol은 Thrift를 이용하여 직접 정의 하였으며, 비트윈 개발팀 내부적으로 사용 중인 RPC 라이브러리인 Alfred에 이 프로토콜을 구현**하였습니다.
[Thrift]를 통해 C++과 Java로 컴파일된 소스코드를 각각 프레젠터의 연결 처리 부분과 로직 처리 부분에서 이용하여 통신합니다.
프레젠터에서는 Multiplexing된 TCP 연결들을 Stream이라고 명명하였으며 이는 SPDY나 HTTP/2에서의 호칭 방법과 유사합니다.
SPDY나 HTTP/2도 일종의 Multiplexing 기능을 제공하고 있으며, 프레젠터의 Multiplexing Protocol도 SPDY 프레임을 많이 참고하여 작성되었습니다.

![멀티플렉싱된 TCP연결][multipexedframe]

<figcaption>수 많은 클라이언트와의 TCP연결을 Stream으로 만들어 하나의 내부 TCP연결을 통해 처리합니다.</figcaption>

Alfred에서는 Multiplexing 된 TCP 연결을 Netty의 [Channel 인터페이스]로 추상화하였습니다.
Netty에서 TCP 연결 하나는 Channel 하나로 만들어지는데, 실제 Stream도 Channel 인터페이스로 데이터를 읽거나 쓸 수 있도록 하였습니다.
이 추상화 덕분에 비트윈 비즈니스 로직을 담당하는 코드에서는 Stream으로 Multiplexing 된 TCP 연결을 마치 기존의 TCP 연결과 똑같이 Channel을 이용해 사용할 수 있었습니다.
그래서 **실제 비즈니스 로직 코드는 전혀 건드리지 않고 프레젠터를 쉽게 붙일 수 있었습니다.**

### 로드 밸런싱

클라이언트는 Route53에서 제공하는 DNS Round Robin 기능을 이용하여 아무 프레젠터에 연결하여 채팅 요청을 날리게 됩니다.
하지만 **무조건 동등하게 Round Robin 하게 되면 새로 켜지거나 하여 연결을 거의 맺지 않고 놀고 있는 프레젠터가 있는데도 연결을 많이 맺고 있는 기존 프레젠터에에 연결이 할당되는 문제**가 생길 수 있습니다.
충분한 시간이 흐르면 결국에는 연결 개수는 동등하게 되겠지만, 처음부터 놀고 있는 프레젠터에 새로운 연결을 가중치를 주어 할당하면 로드를 분산되는 데 큰 도움이 될 것입니다.
그래서 **Route53의 [Weighted Routing Policy] 기능을 이용**하기로 하였습니다. 현재 연결 개수와 CPU 사용량 등을 종합적으로 고려하여 Weight를 결정하고 이를 주기적으로 Route53의 레코드에 업데이트합니다.
이런 방법으로 현재 로드가 많이 걸리는 서버로는 적은 수의 새로운 연결을 맺게 하고 자원이 많이 남는 프레젠터로 더 많은 새로운 연결이 맺어지도록 하고 있습니다.

### 스케일 인/아웃

AWS에서는 트래픽에 따라 서버 개수를 늘리기도 하고 줄이기도 하는 [AutoScaling] 이라는 기능이 있습니다.
프레젠터가 스케일 아웃될때에는 프레젠터가 스스로 Route53에 레코드를 추가하는 식으로 새로운 연결을 맺도록 할 수 있습니다.
하지만 **스케일 인으로 프레젠터가 제거될 때에는 Route53에서 레코드를 삭제하더라도 함부로 프레젠터 서버를 종료시킬 수 없습니다.**
종종 클라이언트의 DNS 캐싱 로직에 문제가 있어, Route53에서 레코드를 삭제되었는데도 불구하고 이를 업데이트하지 못해 기존 프레젠터로 연결을 시도하는 경우가 있을 수 있기 때문입니다.
따라서 프레젠터 클러스터가 스케일 인 될 때에는 기존의 모든 연결이 끊어지고 충분한 시간 동안 새로운 연결이 생기지 않은 경우에만 서버를 종료시켜야 합니다.
**AutoScaling Group의 [LifeCycleHook]을 이용하여 위와 같은 조건을 만족 시켰을 때에만 프레젠터 서버를 완전히 종료**시키도록 하였습니다.

## 못다 한 이야기

프레젠터라는 이름이 이상하다고 생각하시는 분들이 있을 것으로 생각합니다.
멀티티어 아키텍처를 이야기할 때 **프레젠테이션 티어, 어플리케이션 티어, 데이터베이스 티어로 구분하곤 하는데 이 프레젠테이션 티어에서 나온 이름**입니다.
지금은 실제 프레젠터가 하는 역할과 프레젠테이션 티어가 보통 맡게 되는 역할에는 많은 차이가 있지만, 어쩌다 보니 이름은 그대로 가져가게 되었습니다.

프레젠터에서 AutoScaling을 하기 위해 LifeCycleHook을 이용합니다.
이때 **프레젠터를 위해 LifeCycleHook 이벤트를 처리하는 프로그램을 직접 짠 것이 아니라 비트윈 개발팀이 내부적으로 만든 Kharon이라는 프로그램을 이용**하였습니다.
Kharon은 인스턴스가 시작되거나 종료될 때 실행할 스크립트를 작성하고 인스턴스의 특정 위치에 놓는 것만으로 LifeCycleHook을 쉽게 이용할 수 있게 하는 프로그램입니다.
Kharon 덕분에 비트윈 내 다양한 시스템에서 별다른 추가 개발 없이 LifeCycleHook을 쉽게 활용하고 있습니다. 후에 Kharon에 대해 자세히 다뤄보도록 하겠습니다.

## 정리

비트윈 개발팀에서는 **오랫동안 유지되는 수많은 채팅 서버 연결들을 처리하고 클라이언트와 서버 간 프로토콜을 단순화시키는 등 여러 이점을 얻고자 ELB의 역할을 대신하는 프레젠터**를 만들었습니다.
프레젠터를 만드는 과정에서 여러 기술적 문제가 있었습니다. 이를 해결하기 위해 C++로 연결 유지 모듈을 따로 작성하였고 Multiplexing Protocol을 따로 정의하였으며 그 외 여러 가지 기술적인 결정들을 하였습니다.
이런 과정에서 **시행착오들이 있었지만 이를 발판 삼아 더 좋은 기술적 결정을 내리기 위해 고민하여 결국 기존 시스템에 쉽게 적용할 수 있고 쉽게 동작하는 프레젠터를 만들어 이용**하고 있습니다.

[비트윈의 시스템 아키텍처]: http://engineering.vcnc.co.kr/2013/04/between-system-architecture/
[멀티티어 아키텍처]: https://en.wikipedia.org/wiki/Multitier_architecture
[elb]: https://aws.amazon.com/elasticloadbalancing/
[consistent hash]: https://en.wikipedia.org/wiki/Consistent_hashing
[zookeeper]: https://zookeeper.apache.org/
[dns round robin]: https://en.wikipedia.org/wiki/Round-robin_DNS
[finaglemux]: http://twitter.github.io/finagle/guide/Protocols.html#mux
[openssl]: https://www.OpenSSL.org/
[libevent]: http://libevent.org/
[netty]: http://netty.io/
[http/2]: https://http2.github.io/
[spdy]: https://developers.google.com/speed/spdy/
[quic]: https://www.chromium.org/quic
[tcp fast open]: https://en.wikipedia.org/wiki/TCP_Fast_Open
[ssl session ticket]: https://www.ietf.org/rfc/rfc5077.txt
[folly]: https://github.com/facebook/folly
[netty-tcnative]: https://github.com/netty/netty-tcnative
[thrift]: https://thrift.apache.org/
[channel 인터페이스]: http://netty.io/3.10/api/org/jboss/netty/channel/Channel.html
[route53]: https://aws.amazon.com/route53/
[weighted routing policy]: http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html#routing-policy-weighted
[autoscaling]: https://aws.amazon.com/autoscaling/
[lifecyclehook]: http://docs.aws.amazon.com/AutoScaling/latest/DeveloperGuide/introducing-lifecycle-hooks.html
[presenterarchitecture]: ./presenter-architecture.jpg
[multiplexingprotocol]: ./presenter-multiplexing-protocol.jpg
[presentermodule]: ./presenter-module.jpg
[multipexedframe]: ./presenter-multiplexed-connection.jpg
