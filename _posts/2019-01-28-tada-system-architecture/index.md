---
layout: post
date: 2019-01-28 10:00:00 +09:00
permalink: /2019-01-28-tada-system-architecture
disqusUrl: http://engineering.vcnc.co.kr/2019/01/tada-system-architecture/

title: '타다 시스템 아키텍처'
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
description: 타다라는 완전히 새로운 서비스를 성공적으로 런칭하기 위해 많은 고민을 하였습니다.
  고민 끝에 만들어진 타다의 시스템 구성과 이를 위해 사용한 여러 기술들을 소개하고
  그 동안의 타다 개발팀의 기술적 결정에 대해 소개하려고 합니다.

tags: ['타다', '시스템', '아키텍처', '설계', 'AWS', 'Kubernetes', 'Kotlin']

authors:
  - name: 'James Lee'
    facebook: https://www.facebook.com/eincs
    twitter: https://twitter.com/eincs
    google: https://plus.google.com/u/0/117656116840561651263/posts
    link: http://eincs.com
---

2018년에는 VCNC에 큰 변화가 있었습니다.
오랫동안 비트윈 기반의 서비스들을 개발하고 운영했지만
2018년 10월에 기사 포함 렌터카 서비스를 포함한 종합 모빌리티 플랫폼인 **[타다][tada]** 를 기획하고 출시하였습니다.
변화가 많은 모빌리티 시장에서 신규 서비스를 성공적으로 출시하기 위해 많은 고민을 하였습니다.
이번 글에서는 **타다의 시스템 구성과 이를 위해 사용한 여러 기술을 소개하면서, 타다 개발팀의 기술적 결정을 공유**해보고자 합니다.

![타다에서 사용하는 소프트웨어]

<figcaption>타다에서 사용하는 기술들의 로고. 왼쪽부터 Kotlin, Spring Boot, Kubernetes, Terraform, gRPC, Redis.</figcaption>

## [기존과 다른 선택](id:yet-another-choice)

비트윈의 경우 [Netty를 이용해 인하우스 네트워크 라이브러리][alfred]를 만들기도 하였고,
[메인 데이터베이스로 NoSQL인 HBase를 사용][hbaseonvcnc]하는 등 남들이 통상적으로 사용하지 않는 기술 스택을 선택한 경우가 많았습니다.
그 배경에는 나름대로 이유가 있었지만, 서비스 초기에는 안정성에 어려움을 겪기도 하였고 서버 배포 과정이 느리고 복잡하여 쉬운 길은 아니었습니다.
여러 문제를 해결하기 위해 [Haeinsa] 등 라이브러리와 소프트웨어를 직접 만들기도 하였습니다.

타다는 이슈가 많은 모빌리티 시장을 타겟으로 하고 있기 때문에 **Time to Market이 특히 중요**했습니다.
개발하는 기간 동안 **시장 상황에 따라 기능의 우선순위가 변하기도** 하였습니다.
이에 따라 서비스를 빨리 출시하고 외부의 변화에 유연하게 대처할 수 있도록,
**완성도 있게 만들어져 있는 프레임워크나 라이브러리를 선택**하였고, **AWS에서 이미 잘 관리되고 있는 서비스를 적극적으로 활용**하였습니다.

## [사용 중인 기술들](id:softwares)

- **[Kotlin]**: Java는 불편한 점이 많지만, JVM에 대한 경험을 무시할 수는 없어 비교적 새로운 JVM 기반 언어인 Kotlin을 사용하기로 하였습니다.
  다른 여러 JVM 기반의 대안 언어들이 있지만, **Spring Boot에 쉽게 적용할 수 있고 커뮤니티에서 적극적으로 권장하고 있는 점 등
  여러 이유로 Kotlin을 선택**하게 되었습니다.
- **[Spring Boot]**: 널리 쓰는 웹 프레임워크이며 이미 지원하는 기능 또한 많기 때문에
  **보일러 플레이트 코드 작성을 줄이고 서비스 개발에 집중**할 수 있습니다.
  [SQS 메시지 처리][springbootsqslistener], [HTTP 요청 및 응답으로 Protocol Buffers 메시지 사용][protobufhttpmessageconverter]
  등 프레임워크에서 제공하는 기능을 많이 활용하고 있습니다.
- **[Kubernetes]**: 컨테이너 오케스트레이션 플랫폼으로 배포 자동화와 스케일링 등 여러 가지 운영적인 편의성을 제공합니다.
  처음에는 [kops]를 이용해 클러스터를 직접 띄웠지만, 지금은 [EKS]를 이용하고 있으며 직접 object를 만들기보다 **[helm]** 을 이용하고 있습니다.
- **[gRPC]**: 실시간성이 중요한 차량 위치나 운행 상태 변화 등은 [Streaming을 이용][grpcserversidestreaming]하여 전달하고 있습니다.
  직접 개발할 수도 있었지만, **서비스 개발에 집중하고 앞으로의 관리 오버헤드를 줄이기 위해** gRPC를 이용하기로 하였습니다.
- **[Redis]**: 서버 간 메시징을 위해 Redis의 [Pub/Sub][redispubsub] 기능을 사용하고 있습니다.
  메시지 브로커 기능을 제공하는 [RabbitMQ], [ActiveMQ], [Kafka] 등 여러 옵션이 있었지만,
  개발을 시작하던 당시에는 Redis만이 **[ElastiCache]를 이용하여 쉽게 띄우고 관리할 수** 있어 Redis를 선택하게 되었습니다.
- **[Protocol Buffers]**: gRPC 뿐만 아니라 HTTP/2로 주고받는 메시지를 정의할 때도 이용하고 있습니다.
  덕분에 **따로 문서화 하지 않고 proto파일을 공유하여 더욱 명확하고 편리하게 API 명세를 공유**할 수 있었습니다.
- **[Terraform]**: **[HCL]** 을 이용해 인프라스트럭처 프로비저닝 및 관리를 편하게 해주는 도구입니다.
  AWS 서비스의 생성 및 관리를 콘솔에서 직접 하지 않고 Terraform을 이용하고 있습니다.

## [사용 중인 AWS 서비스들](id:aws-services)

AWS는 개발팀이 **오랜 기간 사용하여 가장 익숙한 클라우드 플랫폼이기 때문에 큰 고민 없이 선택**할 수 있었습니다.

- **[EKS]**: Kubernetes 클러스터의 마스터 노드들을 쉽게 띄우고 관리해주는 서비스입니다.
  서울 리전에 EKS가 출시된 후에는 **관리 오버헤드를 줄이기 위해** EKS로 옮겼습니다.
- **[ECR]**: 타다 서버를 배포할 때는 [Docker Gradle Plugin]을 통해 docker 이미지를 만들고 ECR에 푸시합니다.
  그 후 [helm] 명령을 통해 Kubernetes에 배포합니다.
- **[SQS]**: 배차 요청을 처리하기 위해 SQS를 이용합니다.
  배차 요청을 구현하는 방법에는 다양한 옵션이 있었지만 **AWS 서비스를 최대한 활용하여 빠르게 개발**할 수 있었습니다.
- **[RDS]**: 타다의 대부분 데이터는 **[Aurora]** 에 저장하고 있습니다.
  RDS를 이용하면 DB의 **배포와 관리가 쉬우며**, Aurora는 MySQL과 호환될 뿐만 아니라 같은 비용이면 성능이 더 좋습니다.
- **[Kinesis]**: 실시간 차량 위치 정보 및 로그를 수집하기 위해 사용하고 있습니다.
  다른 오픈소스 소프트웨어를 직접 이용하기보다는 **AWS에서 제공하는 서비스를 최대한 이용**하고 있습니다.
- **[Firehose]**: 비트윈에서는 [KCL]를 활용해 Acheron이라는 프로그램을 직접 만들어 로그들을 S3에 저장하였지만,
  이제는 **서울 리전에서 Firehose를 사용할 수 있으므로 큰 고민 없이 사용**하기로 하였습니다.

## [시스템 구성](id:system-architecture)

타다에서는 필요에 따라 서비스를 여러 종류로 분리하여 운영하고 있습니다.
일반적인 모바일 앱 API와 실시간 차량의 위치 정보를 바탕으로 사용자의 요청에 대해 적합한 차량을 배차하는 기능이 필요했습니다.
핵심적인 역할을 하는 일부 서비스와 시스템 구성에 대해 간단하게 소개합니다.

![타다 시스템 아키텍처 다이어그램]

- **[라이더 앱][tada]**: 아이폰은 [Swift], 안드로이드는 [Kotlin]으로 작성하였으며 여러 오픈소스 라이브러리를 적극적으로 활용하였습니다.
  **[서비스 특성상 RIBs라는 아키텍처를 사용하여 개발][ribs]** 하였습니다.
- **[드라이버 앱][tadadriver]**: 아이폰과 안드로이드를 모두 지원하려면 기술적, UX적으로 고려해야 할 점들이 많고
  불특정 다수의 유저를 대상으로 하는 앱도 아니었기 때문에 안드로이드 버전으로만 개발하게 되었습니다.
- **서버**: 모바일 앱의 요청을 대부분 처리하며 [Spring Boot]로 작성된 HTTP/2 API 서버입니다.
  [Protocol Buffers]로 정의된 메시지를 JSON 형태로 주고받습니다.
- **gRPC 서버**: 서버에서 발생하는 이벤트를 실시간으로 전달하기 위한 서버입니다.
  Redis [Pub/Sub][redispubsub]을 통해 받은 이벤트 메시지들을 클라이언트들에게 전달합니다.
- **Dispatcher**: 배차 요청을 처리하는 서버입니다. 주변 차들의 [ETA] 계산을 위해 외부 API를 이용하는데,
  **[Reactor]를 이용해 비동기적, 동시적으로 요청하여 쓰레드 점유 없이 효율적으로 처리** 되도록 구현하였습니다.
- **Tracker**: 차량 위치 정보 수집 서버입니다. [KCL]를 이용해 위치 정보 레코드를 읽어 들여 TrackerDB에 기록합니다.
- **Redis**: 서비스 초기에는 차량의 최신 위치 등을 저장하기도 했지만, 지금은 주로 서버 간 메시징을 위해 [Pub/Sub][redispubsub] 기능을 이용하고 있습니다.
- **DB**: 운행 기록, 사용자 데이터 등 대부분 데이터를 기록합니다.
  비트윈에서는 HBase를 이용했지만 타다의 경우 **아직 절대적인 트래픽이 많지 않기 때문에 트랜잭션 등 다양한 편의 기능을 제공하는 RDB를 이용**하고 있습니다.
- **TrackerDB**: 차량 운행 정보 및 차량의 최신 위치 등을 저장합니다. Aurora를 이용하며
  대부분의 요청이 차량 위치 정보 업데이트이므로 안정성을 위해 별도의 인스턴스를 띄워 사용하고 있습니다.
- **Kinesis Log Stream**: 타다의 여러 서비스에서 로깅을 위해 이용합니다. Firehose를 통해 S3에 기록됩니다.
- **Kinesis Tracker Stream**: 드라이버의 실시간 위치 정보는 Kinesis를 통해 Tracker로 전달됩니다.

## [서비스 플로우](id:service-flow)

### [차량 위치 업데이트](id:update-vehicle-location-flow)

차량 위치 업데이트는 요금 계산, 차량 위치 제공 등 **서비스에서 가장 많이 일어나는 요청**입니다.
드라이버 앱에서 안드로이드 Foreground 서비스를 이용해 GPS 정보를 수집하고 일정 주기마다 서버로 현재 위치를 전송합니다.
이렇게 전송받은 GPS 위치 정보는 **데이터 크기를 최소화하기 위해 Protocol Buffers로 직렬화**되어 Kinesis 레코드로 만들어지게 됩니다.
Tracker에서는 전달된 Kinesis 레코드를 읽어 간단한 처리를 한 후에 TrackerDB에 삽입합니다.

![위치 정보 업데이트 서비스 플로우]

서비스 초기에는 차량의 마지막 위치에 대한 정보만 Redis에 적었습니다.
그러나 차량의 이동 경로를 효율적으로 조회해야 할 일이 생겼는데, 당시 차량 이동 경로는 로그로만 저장되고 있었습니다.
**[S3 Select]** 나 **[Athena]** 를 이용해 조회하는 방안도 고려했지만, 일단은 Aurora에 저장하기로 하였습니다.
**당분간은 Aurora로도 충분했고 RDB를 쓰는 것이 가장 쉽고 편한 방법**이었기 때문입니다.

### [차량 배차](id:dispatch-flow)

차량 배차는 **서비스의 가장 기본적인 기능**으로 배차 요청에 가장 적절한 주변 차량을 할당하는 플로우입니다.
라이더 앱에서 유저가 배차를 요청하면 서버가 배차 요청 정보를 DB에 기록하고 배차 요청 메시지를 SQS 대기열에 집어넣습니다.
Dispatcher가 배차를 처리하는 로직을 수행하여 차량이 매칭되면 드라이버 앱으로 이벤트가 전달됩니다.

![배차 서비스 플로우]

드라이버가 배차를 수락하면 서버로 수락 요청이 전송되고 서버에서는 DB의 배차 요청 상태를 수락 상태로 변경합니다.
배차 요청이 수락되었다는 이벤트는 결과적으로 gRPC 서버를 통해 해당 이벤트를 구독하고 있던 유저에게 전달됩니다.

![배차 수락 서비스 플로우]

Dispatcher에서 배차를 처리하는 로직은 여러 옵션이 있었지만 **가장 간단하고 효율적으로 개발하기 위해 SQS의 기능을 최대한 활용**하였습니다.
Dispatcher 수를 늘리는 것만으로도 처리량 확장이 가능하며 Dispatcher가 갑자기 종료되어도 한 대라도 살아있다면 결국에는 잘 처리가 됩니다.
Dispatcher가 배차 요청을 받으면 다음과 같은 로직을 수행합니다. 종료 조건을 만족하지 않았다면 일정 시간 후 동일한 로직을 다시 반복합니다.

- *배차가 가능한 상태*라면 배차 로직을 수행합니다. 이동 경로와 교통정보를 고려하여 적합한 주변 차량을 찾습니다.
  - _만약 적합한 차량이 있다면_ 배차 요청을 해당 드라이버에게 할당되었다는 정보를 DB에 적고 배차 할당 이벤트를 전파합니다.
    드라이버의 수락을 기다리기 위해 일정 시간 후 로직을 재시도합니다.
  - _만약 적합한 차량이 없다면_ 일정 시간 후에 로직을 재시도합니다.
- *배차 요청이 드라이버의 수락을 기다려야 하거나 타임아웃이 남아있는 상태*라면 적절한 시간 후 재시도합니다.
- *배차 요청이 수락되어 완료된 상태거나 취소되었거나 타임아웃이 지난 상태*라면 SQS에서 메시지를 삭제합니다.

## [못다 한 이야기](id:one-more-thing)

[타다][tada]를 런칭하는 날, [기사 간담회][tadapress]에서
[쏘카의 VCNC 인수][vcncsocar] 이후 짧은 기간 동안 타다를 만들 수 있었을 리 없으니, 실제 개발 기간은 어느 정도냐는 질문이 있었습니다.
짧은 기간 내 서비스를 성공적으로 런칭할 수 있었던 것은 상황에 맞는 올바른 기술적 선택들뿐만 아니라 훌륭한 팀원들이 있었기에 가능했던 일이었습니다.
타다는 개선해야 할 부분도 많고 앞으로 새로운 기술적 도전들이 많이 있을 것입니다.

네 그렇습니다. 결론은 **기술적 난제들을 고민하면서 좋은 팀과 서비스를 함께 만들고 키워나갈 좋은 분들을 기다리고 있다**는 것입니다.

[tada]: https://tadatada.com/
[kotlin]: https://kotlinlang.org/
[swift]: https://developer.apple.com/kr/swift/
[spring boot]: https://spring.io/projects/spring-boot
[terraform]: https://www.terraform.io/
[kubernetes]: https://kubernetes.io/
[grpc]: https://grpc.io/
[redis]: https://redis.io/
[protocol buffers]: https://developers.google.com/protocol-buffers/
[prometheus]: https://prometheus.io/
[pagerduty]: https://www.pagerduty.com/
[ec2]: https://aws.amazon.com/ko/ec2/
[elasticache]: https://aws.amazon.com/ko/elasticache/
[eks]: https://aws.amazon.com/ko/eks/
[ecr]: https://aws.amazon.com/ko/ecr/
[sqs]: https://aws.amazon.com/ko/sqs/
[rds]: https://aws.amazon.com/ko/rds/
[aurora]: https://aws.amazon.com/ko/rds/aurora/
[kinesis]: https://aws.amazon.com/ko/kinesis/
[firehose]: https://aws.amazon.com/ko/kinesis/data-firehose/
[cloudwatch]: https://aws.amazon.com/ko/cloudwatch/
[haeinsa]: /2013-10-10-announcing-haeinsa
[hbaseonvcnc]: /2014-05-07-hbase-schema-in-between
[alfred]: /2015-11-30-presenter-multitier-architecture
[hcl]: https://github.com/hashicorp/hcl
[kops]: https://github.com/kubernetes/kops
[helm]: https://helm.sh/
[s3 select]: https://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectSELECTContent.html
[athena]: https://aws.amazon.com/ko/athena/
[docker gradle plugin]: https://github.com/palantir/gradle-docker
[springbootsqslistener]: https://cloud.spring.io/spring-cloud-aws/1.2.x/#_consuming_aws_event_messages_with_amazon_sqs
[protobufhttpmessageconverter]: https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/http/converter/protobuf/ProtobufHttpMessageConverter.java
[ribs]: https://speakerdeck.com/vcnc/rxribs-multiplatform-architecture-with-rx
[reactor]: https://projectreactor.io/
[kcl]: https://github.com/awslabs/amazon-kinesis-client
[tadapress]: https://platum.kr/archives/107859
[vcncsocar]: https://platum.kr/archives/103440
[grpcserversidestreaming]: https://grpc.io/docs/guides/concepts.html#server-streaming-rpc
[tadadriver]: https://sites.google.com/vcnc.co.kr/tadadriverapply
[redispubsub]: https://redis.io/topics/pubsub
[rabbitmq]: https://www.rabbitmq.com/
[activemq]: http://activemq.apache.org/
[kafka]: https://kafka.apache.org/
[eta]: https://en.wikipedia.org/wiki/Estimated_time_of_arrival
[타다에서 사용하는 소프트웨어]: ./tada-stack.png
[타다 시스템 아키텍처 다이어그램]: ./tada-architecture.png
[배차 서비스 플로우]: ./tada-dispatch.png
[배차 수락 서비스 플로우]: ./tada-dispatch-accept.png
[위치 정보 업데이트 서비스 플로우]: ./tada-tracker.png
