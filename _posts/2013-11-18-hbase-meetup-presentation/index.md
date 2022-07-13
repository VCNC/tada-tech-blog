---
layout: post
date: 2013-11-21 10:00:00 +09:00
permalink: /2013-11-18-hbase-meetup-presentation
disqusUrl: http://engineering.vcnc.co.kr/2013/11/hbase-meetup-presentation/

title: 'HBase Meetup - 비트윈에서 HBase를 사용하는 방법'
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
description:
  비트윈에서는 서비스 초기부터 HBase를 주요 데이터베이스로 사용였으며 사용자 로그를 분석하는 데에도 HBase를 이용하고 있습니다.
  2013년 11월 15일에 HBase를 만든 Michael Stack이 한국을 방문하게 되어 HBase Meetup Seoul 모임을 가졌습니다.
  그 자리에서 VCNC에서 비트윈을 운영하면서 HBase를 사용했던 경험들이나 HBase 트랜잭션 라이브러리인 Haeinsa에 대해 간단히 소개드리는 발표 기회를 가질 수 있었습니다.
  이 글에서는 이때 발표한 내용에 대해 간단히 소개하고자 합니다.
tags: ['VCNC', 'HBase', 'Meetup', 'Haeinsa', '해인사', '트랜잭션']

authors:
  - name: 'Andrew Kim'
    facebook: https://www.facebook.com/ewmkkpe
    link: https://www.facebook.com/ewmkkpe
---

[비트윈]에서는 서비스 초기부터 HBase를 주요 데이터베이스로 사용하였으며 [사용자 로그를 분석][analyzinguserdata]하는 데에도 HBase를 사용하고 있습니다.
지난 주 금요일(11월 15일)에 HBase를 만든 [Michael Stack] 씨가 한국을 방문하게 되어 [ZDNet] 송경석 팀장님의 주최 하에 HBase Meetup Seoul 모임을 가졌습니다.
그 자리에서 VCNC에서 비트윈을 운영하면서 HBase를 사용했던 경험들이나 HBase 트랜잭션 라이브러리인 [Haeinsa]에 대해 간단히 소개해 드리는 발표 기회를 가질 수 있었습니다.
이 글에서 발표한 내용에 대해 간단히 소개하고자 합니다.

- **비트윈 서비스에 HBase를 사용하는 이유**  
  비트윈에서 가장 많이 사용되는 기능 중 하나가 채팅이며, 채팅은 상대적으로 복잡한 데이터 구조나 연산이 필요하지 않기 때문에 HBase 의 단순한 schema 구조가 큰 문제가 되지 않습니다.
  특히 쓰기 연산이 다른 기능보다 많이 일어나기 때문에 높은 쓰기 연산 성능이 필요합니다.
  그래서 메세징이 중심이 되는 서비스는 높은 확장성(Scalability)과 쓰기 성능을 가진 HBase가 유리하며 비슷한 이유로 [라인][hbaseinline]이나 [페이스북 메신저][hbaseinfacebookmessenger]에서도 HBase를 사용하는 것이라고 짐작할 수 있습니다.

- **로그 분석에도 HBase를 사용합니다**  
  비트윈은 사용자 로그 분석을 통해서 좀 더 나은 비트윈이 되기 위해서 노력하고 있습니다.
  비트윈 사용자가 남기는 로그의 양이 하루에 3억건이 넘기 때문에 RDBMS에 저장하여 쿼리로 분석하기는 힘듭니다.
  그래서 로그 분석을 위해 분산 데이터 처리 프레임워크인 Hadoop MapReduce를 이용하며 로그들은 MapReduce와 호환성이 좋은 HBase에 저장하고 있습니다.
  또한 이렇게 MapReduce 작업들을 통해 정제된 분석 결과를 MySQL에 저장한 후에 다양한 쿼리와 시각화 도구들로 custom dashboard를 만들어 운영하고 있습니다.
  이를 바탕으로 저희 Biz development팀(사업개발팀)이나 Data-driven팀(데이터 분석팀)이 손쉽게 insight를 얻어낼 수 있도록 돕고 있습니다.

- **HBase를 사용하면서 삽질 했던 경험**  
  HBase를 사용하면서 처음에는 잘못 사용하고 있었던 점이 많았고 차근차근 고쳐나갔습니다.
  Region Split과 Major Compaction을 수동으로 직접 하는 등 다양한 최적화를 통해 처음보다 훨씬 잘 쓰고 있습니다.
  HBase 설정 최적화에 대한 이야기는 [이전에 올렸던 블로그 글][hbaseoptimization]에서도 간단히 소개한 적이 있으니 확인해보시기 바랍니다.

- **HBase 트랜잭션 라이브러리 해인사**  
  **Haeinsa는 HBase에서 Multi-Row 트랜잭션을 제공하기 위한 라이브러리**입니다.
  [오픈소스로 공개][haeinsa]되어 있으며 [Deview에서도 발표][haeinsaindeview]를 했었습니다.
  HBase에 아무런 변형도 가하지 않았기 때문에 기존에 사용하던 HBase 클러스터에 쉽게 적용할 수 있습니다.
  비트윈에 실제로 적용되어 하루 3억 건 이상의 트랜잭션을 처리하고 있으며 다른 많은 NoSQL 기반 트랜잭션 라이브러리보다 높은 확장성과 좋은 성능을 가지고 있습니다.

발표에서 사용했던 슬라이드를 첨부하였으니 도움이 되었으면 합니다.

<script async class="speakerdeck-embed" data-id="2b8092b02ff90131ef414aa7d272d735" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>

[비트윈]: http://between.us/
[analyzinguserdata]: http://engineering.vcnc.co.kr/2013/05/analyzing-user-data/
[michael stack]: https://www.linkedin.com/pub/michael-stack/1/587/110
[zdnet]: http://www.zdnet.co.kr/
[haeinsa]: https://github.com/vcnc/haeinsa
[hbaseinline]: http://tech.naver.jp/blog/?p=1420
[hbaseinfacebookmessenger]: http://www.slideshare.net/brizzzdotcom/facebook-messages-hbase
[hbaseoptimization]: http://engineering.vcnc.co.kr/2013/04/hbase-configuration/
[haeinsaindeview]: https://speakerdeck.com/vcnc/haeinsa-hbase-transaction-library
