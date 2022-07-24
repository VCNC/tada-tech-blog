---
layout: post
date: 2013-04-18 10:00:00 +09:00
permalink: /2013-04-18-between-system-architecture
disqusUrl: http://engineering.vcnc.co.kr/2013/04/between-system-architecture/

title: '비트윈 시스템 아키텍처'
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
image: ./between_icon.png
description: VCNC는 커플을 위한 모바일 앱 비트윈을 서비스하고 있습니다.
  비트윈은 사진, 메모, 채팅, 기념일 등 다양한 기능을 제공하며, 오픈 베타 테스트를 시작한 2011년 11월부터 현재까지 연인 간의 소통을 돕고 있습니다.
  그동안 비트윈 시스템 아키텍처에는 많은 변화가 있었으며 다양한 결정을 하였습니다.
  비트윈 아키텍처를 발전시키면서 배우게 된 여러 가지 노하우를 정리하여 공유해보고자 합니다.
  그리고 저희가 앞으로 나아갈 방향을 소개하려 합니다.
tags:
  [
    'Between',
    'Server',
    'Architecture',
    '비트윈',
    '시스템',
    '아키텍처',
    'Netty',
    'HBase',
    'Thrift',
    'ZooKeeper',
    'AWS',
    'Haeinsa',
    'Rocky',
  ]

authors:
  - name: 'James Lee'
    facebook: https://www.facebook.com/eincs
    twitter: https://twitter.com/eincs
    google: https://plus.google.com/u/0/117656116840561651263/posts
    link: http://eincs.com
---

VCNC는 커플을 위한 모바일 앱 [비트윈][between]을 서비스하고 있습니다.
비트윈은 사진, 메모, 채팅, 기념일 등 다양한 기능을 제공하며, 오픈 베타 테스트를 시작한 2011년 11월부터 현재까지 연인 간의 소통을 돕고 있습니다.
그동안 비트윈 시스템 아키텍처에는 많은 변화가 있었으며 다양한 결정을 하였습니다.
비트윈 아키텍처를 발전시키면서 배우게 된 여러 가지 노하우를 정리하여 공유해보고자 합니다.
그리고 저희가 앞으로 나아갈 방향을 소개하려 합니다.

## 소프트웨어 스택

- **Java**: 비트윈 API서버는 Java로 작성되어 있습니다.
  이는 처음 비트윈 서버를 만들기 시작할 때, 서버 개발자가 가장 빨리 개발해낼 수 있는 언어로 프로그래밍을 시작했기 때문입니다.
  지금도 자바를 가장 잘 다루는 서버 개발자가 많으므로 여전히 유효한 선택입니다.
- **[Netty]**: 대부분의 API는 HTTP로 호출되며, 채팅은 모바일 네트워크상에서의 전송 속도를 위해 TCP상에서 프로토콜을 구현했습니다.
  두 가지 모두 Netty를 통해 사용자 요청을 처리합니다.
  Netty를 선택한 것은 뛰어난 성능과 서비스 구현 시 Thrift 서비스를 통해 HTTP와 TCP 프로토콜을 한 번에 구현하기 쉽다는 점 때문이었습니다.
- **[Thrift]**: API서버의 모든 서비스는 Thrift 서비스로 구현됩니다.
  따라서 TCP뿐만 아니라 HTTP 또한 Thrift 인터페이스를 사용합니다. *HTTP를 굳이 Thrift서비스로 구현한 이유는, TCP로 메세징 전송 시 똑같은 서비스를 그대로 사용하기 위함*이었습니다.
  덕분에 빠른 채팅 구현 시, 이미 구현된 서비스들을 그대로 사용할 수 있었습니다.
  또한, 채팅 패킷들은 *패킷 경량화를 위해 **[snappy]** 로 압축* 하여 송수신합니다.
  모바일 네트워크상에서는 패킷이 작아질수록 속도 향상에 크게 도움이 됩니다.
- **[HBase]**: 비트윈의 대부분 트랜젝션은 채팅에서 일어납니다.
  수많은 메시지 트랜젝션을 처리하기 위해 HBase를 선택했으며, 당시 서버 개발자가 가장 익숙한 데이터베이스가 HBase였습니다.
  서비스 초기부터 확장성을 고려했어야 했는데, RDBMS에서 확장성에 대해 생각하는 것보다는
  당장 익숙한 HBase를 선택하고 운영하면서 나오는 문제들은 차차 해결하였습니다.
- **[ZooKeeper]**: 커플들을 여러 서버에 밸런싱하고 이 정보를 여러 서버에서 공유하기 위해 ZooKeeper를 이용합니다.
  Netflix에서 공개한 오픈 소스인 **[Curator]** 를 이용하여 접근합니다.

## AWS

비트윈은 AWS의 Tokyo리전에서 운영되고 있습니다.
처음에는 네트워크 및 성능상의 이유로 국내 IDC를 고려하기도 했으나
개발자들이 IDC 운영 경험이 거의 없는 것과, IDC의 실질적인 [TCO]가 높다는 문제로 클라우드 서비스를 이용하기로 하였습니다.
당시 클라우드 서비스 중에 가장 안정적이라고 생각했던 AWS 를 사용하기로 결정했었고, 지금도 계속 사용하고 있습니다.

- **[EC2]**: 비트윈의 여러 부가적인 서비스를 위해 다양한 종류의 인스턴스를 사용 중이지만,
  메인 서비스를 운용하기 위해서는 c1.xlarge와 m2.4xlarge 인스턴스를 여러 대 사용하고 있습니다.
  - **API 서버**: HTTP 파싱이나 이미지 리시아징등의 연산이 이 서버에서 일어납니다.
    이 연산들은 CPU 가 가장 중요한 리소스이기 때문에, c1.xlarge를 사용하기로 했습니다.
  - **Database 서버**: HDFS 데이터 노드와 HBase 리전 서버들이 떠있습니다.
    여러 번의 *테스트를 통해 IO가 병목임을 확인하였고, 따라서 모든 데이터를 최대한 메모리에 올리는 것이 가장 저렴한 설정이라는 것을 확인*하였습니다.
    이런 이유 때문에 68.4GB의 메모리를 가진 m2.4xlarge를 Database 서버로 사용하고 있습니다.
- **[EBS]**: 처음에는 HBase상 데이터를 모두 EBS에 저장하였습니다.
  하지만 일정 시간 동안 EBS의 Latency가 갑자기 증가하는 등의 불안정한 경우가 자주 발생하여 개선 방법이 필요했는데,
  데이터를 ephemeral storage에만 저장하기에는 안정성이 확인되지 않은 상태였습니다.
  위의 두 가지 문제를 동시에 해결하기 위해서 HDFS multiple-rack 설정을 통해서 두 개의 복제본은 ephemeral storage에 저장하고
  다른 하나의 복제본은 PIOPS EBS에 저장되도록 구성하여 EBS의 문제점들로부터의 영향을 최소화하였습니다.
- **[S3]**: 사용자들이 올리는 사진들은 s3에 저장됩니다.
  사진의 s3키는 추측이 불가능하도록 랜덤하게 만들어집니다.
  어차피 하나의 사진은 두 명밖에 받아가지 않고 클라이언트 로컬에 캐싱되기 때문에 CloudFront를 사용하지는 않습니다.
- **[ELB]**: HTTP는 사용자 요청의 분산과 SSL적용을 위해 ELB를 사용합니다. TCP는 TLS를 위해 ELB를 사용합니다.
  *SSL/TLS 부분은 모두 AWS의 ELB를 이용*하는데, 이는 API서버의 SSL/TLS처리에 대한 부담을 덜어주기 위함입니다.
- **[CloudWatch]**: 각 통신사와 리전에서 비트윈 서버로의 네트워크 상태와 서버 내의 요청 처리 시간 등의 메트릭을 CloudWatch로 모니터링 하고 있습니다.
  따라서 네트워크 상태나 서버에 문제가 생긴 경우, 이메일 등을 통해 즉각 알게 되어, 문제 상황에 바로 대응하고 있습니다.
  Netflix의 **[Servo]** 를 이용하여 모니터링 됩니다.

## 현재의 아키텍처

처음 클로즈드 베타 테스트때에는 사용자 수가 정해져 있었기 때문에 하나의 인스턴스로 운영되었습니다.
하지만 처음부터 인스턴스 숫자를 늘리는 것만으로도 서비스 규모를 쉽게 확장할 수 있는 아키텍쳐를 만들기 위한 고민을 하였습니다.
오픈 베타 이후에는 발생하는 트래픽에 필요한 만큼 여러 대의 유연하게 서버를 운영하였고,
현재 채팅은 TCP 위에서 구현한 프로토콜을 이용하여 서비스하고 있습니다.

![현재 비트윈의 아키텍처][image1]

- HTTP 요청은 하나의 ELB를 통해 여러 서버로 분산됩니다. 일반적인 ELB+HTTP 아키텍처와 동일합니다.
- 채팅은 TCP 연결을 맺게 되는데, 각 커플은 특정 API 서버로 샤딩되어 특정 커플에 대한 요청을 하나의 서버가 담당합니다.
  *비트윈에서는 커플이 샤딩의 단위*가 됩니다.
- 이를 통해, 채팅 대화 내용 입력 중인지 여부와 같이 굉장히 빈번하게 값이 바뀌는 정보를 인메모리 캐싱할 수 있게 됩니다.
  이런 정보는 휘발성이고 매우 자주 바뀌는 정보이므로, HBase에 저장하는 것은 매우 비효율적입니다.
- [Consistent Hashing]을 이용하여 커플을 각 서버에 샤딩합니다.
  이는 서버가 추가되거나 줄어들 때, 리밸런싱되면서 _서버간 이동되는 커플들의 수를 최소화_ 하기 위함입니다.
- 클라이언트는 샤딩 정보를 바탕으로 특정 서버로 TCP연결을 맺게 되는데, 이를 위해 각 서버에 ELB가 하나씩 붙습니다.
  어떤 서버로 연결을 맺어야 할지는 HTTP 혹은 TCP 프로토콜을 통해 알게 됩니다.
- Consistent Hashing을 위한 정보는 ZooKeeper를 통해 여러 서버간 공유됩니다.
  이를 통해 서버의 수가 늘어나거나 줄어들게 되는 경우, 각 서버는 자신이 담당해야 하는 샤딩에 대한 변경 정보에 대해 즉각 알게 됩니다.
- 이런 아키텍처의 단점은 다음과 같습니다.
  - 클라이언트가 자신이 어떤 서버로 붙어야 하는지 알아야 하기 때문에 프로토콜 및 아키텍처 복잡성이 높습니다.
  - 서버가 늘어나는 경우, 순식간에 많은 사용자 연결이 맺어지게 됩니다.
    따라서 새로 추가되는 ELB는 Warm-up이 필요로 하며 이 때문에 Auto-Scale이 쉽지 않습니다.
  - HBase에 Write연산시, 여러 서버로 복제가 일어나기 때문에, HA을 위한 [Multi-AZ] 구성을 하기가 어렵습니다.
- 한정된 자원으로 동작 가능한 서버를 빨리 만들어내기 위해 이처럼 디자인하였습니다.

## 미래의 아키텍처

현재 아키텍처에 단점을 보완하기 위한 해결 방법을 생각해보았습니다.

![미래의 비트윈의 아키텍처][image2]

- **Haeinsa**는 HBase상에서 트렌젝션을 제공하기 위해 개발 중인 프로젝트입니다.
  구현 완료 후, 기능 테스트를 통과하였고, 퍼포먼스 테스트를 진행하고 있습니다.
  HBase상에서 트렌젝션이 가능하게 되면, 좀 더 복잡한 기능들을 빠르게 개발할 수 있습니다.
  서비스에 곧 적용될 예정입니다.
- **[Multitier Architecture]** 를 통해 클라이언트와 서버 간에 프로토콜을 단순화시킬 수 있습니다.
  이 부분은 개발 초기부터 생각하던 부분인데, 그동안 개발을 하지 못하고 있다가, 지금은 구현을 시작하고 있습니다.
  커플은 특정 Application 서버에서 담당하게 되므로, 인메모리 캐싱이 가능하게 됩니다.
  클라이언트는 무조건 하나의 ELB만 바라보고 요청을 보내게 되고, Presentation 서버가 사용자 요청을 올바른 Application 서버로 릴레이 하게 됩니다.
- Multitier Architecture를 도입하면, 더 이상 ELB Warm-up이 필요하지 않게 되므로,
  Auto-Scale이 가능하게 되며, 좀 더 쉬운 배포가 가능하게 됩니다.
- **Rocky**는 API 서버의 Auto-Failover와 커플에 대한 샤딩을 직접 처리하는 기능을 가진 프로젝트입니다.
  현재 설계가 어느 정도 진행되어 개발 중에 있습니다. 알람이 왔을 때 서버 팀이 마음을 놓고 편히 잠을 잘 수 있는 역할을 합니다.

기본적인 것은 위에서 언급한 구조와 동일하지만 몇 가지 기능이 설정을 추가하면 [Multi-AZ] 구성이 가능합니다.

![먼 미래의 비트윈의 아키텍처][image3]

- 특정 커플에 대한 모든 정보는 하나의 HBase Row에 담기게 됩니다.
- HBase의 특정 리전에 문제가 생긴 경우, 일정 시간이 지나면 자동으로 복구되긴 하지만 잠시 동안 시스템 전체에 문제가 생기가 됩니다.
  이에 대해 [Pinterest에서 Clustering보다는 Sharding이 더 낫다는 글][pinterest highscalbility]을 쓰기도 했습니다.
  이에 대한 해결책은 다음과 같습니다.
  - 원래는 Consistent Hashing을 사용하여 커플들을 Application 서버에 샤딩하였습니다.
    하지만 이제는 HBase에서 Row를 각 리전에 수동으로 할당하고,
    같은 리전에 할당된 Row에 저장된 커플들은 같은 Application 서버에 할당하도록 합니다.
  - 이 경우에, 같은 커플들을 담당하는 Application 서버와 HBase 리전 서버는 물리적으로 같은 머신에 둡니다.
  - 이렇게 구성 하는 경우, 특정 HBase 리전이나 Application 서버에 대한 장애는 특정 샤드에 국한되게 됩니다.
    이와 같이 하나의 머신에 APP과 DB를 같이 두는 구성은 [구글에서도 사용하는 방법][google jeff presentation]입니다.
- 이와 같이 구성하는 경우, [Multi-AZ] 구성이 가능하게 됩니다.
  - AWS에서 같은 리전에서 서로 다른 Zone간 통신은 대략 2~3ms 정도 걸린다고 합니다.
  - Presentation의 경우, 비동기식으로 동작하기 때문에 다른 리전으로 요청을 보내도 부담이 되지 않습니다.
  - HBase에서 Write가 일어나면 여러 복제본을 만들게 됩니다.
    하나의 사용자 요청에 대해 Write가 여러번 일어나기 때문에 HBase연산의 경우에는 서로 다른 Zone간 Latency가 부담으로 작용됩니다.
    Haeinsa가 적용되면, 한 트렌젝션에 대해서 연산을 Batch로 전송하기 때문에 AZ간 Latency 부담이 적습니다.

## 프리젠테이션

다음은 2월에 있었던 [AWS 유저 그룹 세미나][awsug]에서 발표했던 자료 입니다.
비트윈 서버 아키텍처에 대해서 배포 방법을 중심으로 설명이 되어 있습니다.
비슷한 내용이 많이 있으니 살펴보시기 바랍니다.

<script async class="speakerdeck-embed" data-id="e4af60d05bb6013025f71231381b23b3" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

[between]: http://between.us/
[netty]: http://netty.io/
[thrift]: http://thrift.apache.org/
[snappy]: https://code.google.com/p/snappy/
[hbase]: http://hbase.apache.org/
[zookeeper]: http://zookeeper.apache.org/
[curator]: https://github.com/Netflix/curator/
[ec2]: http://aws.amazon.com/ec2/
[ebs]: http://aws.amazon.com/ebs/
[s3]: http://aws.amazon.com/s3/
[elb]: http://aws.amazon.com/elasticloadbalancing/
[cloudwatch]: http://aws.amazon.com/cloudwatch/
[servo]: https://github.com/Netflix/servo/
[consistent hashing]: http://en.wikipedia.org/wiki/Consistent_hashing
[multitier architecture]: http://en.wikipedia.org/wiki/Multitier_architecture
[awsug]: http://www.slideshare.net/awskr/presentations/
[pinterest highscalbility]: http://highscalability.com/blog/2013/4/15/scaling-pinterest-from-0-to-10s-of-billions-of-page-views-a.html
[google jeff presentation]: http://static.googleusercontent.com/external_content/untrusted_dlcp/research.google.com/ko//people/jeff/MIT_BigData_Sep2012.pdf
[multi-az]: http://blog.rightscale.com/2008/03/26/setting-up-a-fault-tolerant-site-using-amazons-availability-zones/
[tco]: http://en.wikipedia.org/wiki/Total_cost_of_ownership
[image1]: ./between-system-architecture-01.png
[image2]: ./between-system-architecture-02.png
[image3]: ./between-system-architecture-03.png
