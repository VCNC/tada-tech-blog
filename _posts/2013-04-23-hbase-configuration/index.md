---
layout: post
date: 2013-04-23 10:00:00 +09:00
permalink: /2013-04-23-hbase-configuration
disqusUrl: http://engineering.vcnc.co.kr/2013/04/hbase-configuration/

title: 'HBase 설정 최적화하기'
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
image: ./hbase.jpg
description: 비트윈 서비스의 메인 데이터베이스로 사용하는 HBase에 대한 운영 경험을 공유하고자 합니다.
  HBase는 오픈소스 NoSQL 분산 데이터베이스의 한 종류로, 뛰어난 Horizontal scalability를 특징으로 합니다.
  VCNC에서는 비트윈 서비스의 메인 데이터베이스뿐 아니라 사용자들의 사용량을 분석하는데도 HBase를 사용하고 있습니다.
  이번 글에서는 성능 최적화를 위한 주요 HBase/HDFS 설정들을 정리해 보았습니다.

tags:
  [
    'HBase',
    'HDFS',
    'Configuration',
    'Performance',
    'Optimization',
    'Between',
    'Developer',
    '비트윈',
    '개발자',
    'hbase-site.xml',
    'hdfs-site.xml',
    'hbase-env.sh',
    'hadoop-env.sh',
  ]

authors:
  - name: 'Andrew Kim'
    facebook: https://www.facebook.com/ewmkkpe
    link: https://www.facebook.com/ewmkkpe
---

[커플 필수 앱 비트윈][비트윈]은 여러 종류의 오픈 소스를 기반으로 이루어져 있습니다.
그 중 하나는 [HBase]라는 NoSQL 데이터베이스입니다.
[VCNC]에서는 HBase를 비트윈 서비스의 메인 데이터베이스로써 사용하고 있으며, 또한 데이터 분석을 위한 DW 서버로도 사용하고 있습니다.

그동안 두 개의 HBase Cluster 모두 최적화를 위해서 여러 가지 설정을 테스트했고 노하우를 공유해 보고자 합니다.
아랫은 저희가 HBase를 실제로 저희 서비스에 적용하여 운영하면서 최적화한 시스템 구성과 설정들을 정리한 것입니다.
HBase를 [OLTP]/[OLAP] 목적으로 사용하고자 하는 분들에게 도움이 되었으면 좋겠습니다.
아래 구성을 최적화하기 위해서 했던 오랜 기간의 삽질기는 언젠가 따로 포스팅 하도록 하겠습니다.

## HBase

HBase는 Google이 2006년에 발표한 [BigTable]이라는 NoSQL 데이터베이스의 아키텍처를 그대로 따르고 있습니다.
HBase는 뛰어난 Horizontal Scalability를 가지는 Distributed DB로써, Column-oriented store model을 가지고 있습니다.
사용량이 늘어남에 따라서 Regionserver만 추가해주면 자연스럽게 Scale-out이 되는 구조를 가지고 있습니다.
또한, Hadoop 특유의 Sequential read/write를 최대한 활용해서 Random access를 줄임으로 Disk를
효율적으로 사용한다는 점을 특징으로 합니다. 이 때문에 HBase는 보통의 RDBMS와는 다르게 Disk IO가 병목이 되기보다는
CPU나 RAM 용량이 병목이 되는 경우가 많습니다.

HBase는 많은 회사가 데이터 분석을 하는 데 활용하고 있으며,
[NHN Line]과 [Facebook messenger] 등의 메신저 서비스에서 Storage로 사용하고 있습니다.

## 시스템 구성

저희는 [Cloudera]에서 제공하는 HBase 0.92.1-cdh4.1.2 release를 사용하고 있으며,
Storage layer로 Hadoop 2.0.0-cdh4.1.2를 사용하고 있습니다.
또한, Between의 데이터베이스로 사용하기 위해서 여러 대의 [AWS EC2]의 m2.4xlarge 인스턴스에
HDFS Datanode / HBase Regionserver를 deploy 하였습니다.
이는 m2.4xlarge의 큰 메모리(68.4GB)를 최대한 활용해서 Disk IO를 회피하고 많은 Cache hit이 나게 하기 위함입니다.

또한 Highly-Available를 위해서 [Quorum Journaling node]를 활용한 Active-standby namenode를 구성했으며,
Zookeeper Cluster와 HBase Master도 여러 대로 구성하여 Datastore layer에서 [SPOF]를 전부 제거하였습니다.
HA cluster를 구성하는 과정도 후에 포스팅 하도록 하겠습니다.

## HDFS 최적화 설정

- **dfs.datanode.handler.count**
  - HDFS에서 외부 요청을 처리하는 데 사용할 Thread의 개수를 정하기 위한 설정입니다. 기본값은 3인데 저희는 100으로 해 놓고 사용하고 있습니다.
- **dfs.replication**
  - HDFS 레벨에서 각각의 데이터가 몇 개의 독립된 인스턴스에 복사될 것 인가를 나타내는 값입니다.
    저희는 이 값을 기본값인 3으로 해 놓고 있습니다.
    이 값을 높이면 Redundancy가 높아져서 데이터 손실에 대해서 더 안전해지지만, Write 속도가 떨어지게 됩니다.
- **dfs.datanode.max.transfer.threads**
  - 하나의 Datanode에서 동시에 서비스 가능한 block 개수 제한을 나타냅니다.
  - 과거에는 dfs.datanode.max.xcievers라는 이름의 설정이었습니다.
  - 기본값은 256인데, 저희는 4096으로 바꿨습니다.
- **ipc.server.tcpnodelay / ipc.client.tcpnodelay**
  - tcpnodelay 설정입니다.
    tcp no delay 설정은 TCP/IP network에서 작은 크기의 패킷들을 모아서 보냄으로써
    TCP 패킷의 overhead를 절약하고자 하는 [Nagle's algorithm]을 끄는 것을 의미합니다.
    기본으로 두 값이 모두 false로 설정되어 있어 Nagle's algorithm이 활성화되어 있습니다.
    Latency가 중요한 OLTP 용도로 HBase를 사용하시면 true로 바꿔서 tcpnodelay 설정을 켜는 것이 유리합니다.

## HBase 최적화 설정

- **hbase.regionserver.handler.count**
  - Regionserver에서 외부로부터 오는 요청을 처리하기 위해서 사용할 Thread의 개수를 정의하기 위한 설정입니다.
    기본값은 10인데 보통 너무 작은 값입니다. [HBase 설정 사이트][hbase configuration]에서는 너무 큰 값이면 좋지 않다고 얘기하고 있지만,
    테스트 결과 m2.4xlarge (26ECU) 에서 200개 Thread까지는 성능 하락이 없는 것으로 나타났습니다. (더 큰 값에 관해서 확인해 보지는 않았습니다.)
  - 저희는 이 값을 10에서 100으로 올린 후에 약 2배의 Throughput 향상을 얻을 수 있었습니다.
- **hfile.block.cache.size**
  - HBase 의 block 들을 cache 하는데 전체 Heap 영역의 얼마를 할당한 것인지를 나타냅니다.
    저희 서비스는 Read가 Write보다 훨씬 많아서 (Write가 전체의 약 3%) Cache hit ratio가 전체 성능에 큰 영향을 미칩니다.
  - HBase 에서는 5분에 한 번 log 파일에 LruBlockCache (HBase 의 Read Cache) 가 얼마 만큼의 메모리를 사용하고 있고,
    Cache hit ratio가 얼마인지 표시를 해줍니다. 이 값을 참조하셔서 최적화에 사용하실 수 있습니다.
  - 저희는 이 값을 0.5로 설정해 놓고 사용하고 있습니다. (50%)
- **hbase.regionserver.global.memstore.lowerLimit / hbase.regionserver.global.memstore.upperLimit**
  - 이 두 개의 설정은 HBase에서 Write 한 값들을 메모리에 캐쉬하고 있는 memstore가 Heap 영역의 얼마만큼을 할당받을지를 나타냅니다.
    이 값이 너무 작으면 메모리에 들고 있을 수 있는 Write의 양이 한정되기 때문에 디스크로 잦은 flush가 일어나게 됩니다.
    반대로 너무 크면 GC에 문제가 있을 수 있으며 Read Cache로 할당할 수 있는 메모리를 낭비하는 것이기 때문에 좋지 않습니다.
  - lowerLimit와 upperLimit의 두 가지 설정이 있는데, 두 개의 설정이 약간 다른 뜻입니다.
    - 만약 memstore 크기의 합이 lowerLimit에 도달하게 되면, Regionserver에서는 memstore들에 대해서 'soft'하게 flush 명령을 내리게 됩니다.
      크기가 큰 memstore 부터 디스크에 쓰이게 되며, 이 작업이 일어나는 동안 새로운 Write가 memstore에 쓰일 수 있습니다.
    - 하지만 memstore 크기의 합이 upperLimit에 도달하게 되면, Regionserver는 memstore들에 대한 추가적인 Write를 막는 'hard'한
      flush 명령을 내리게 됩니다. 즉, 해당 Regionserver이 잠시 동안 Write 요청을 거부하게 되는 것입니다.
      보통 lowerLimit에 도달하면 memstore의 크기가 줄어들기 때문에 upperLimit까지 도달하는 경우는 잘 없지만,
      write-heavy 환경에서 Regionserver가 OOM으로 죽는 경우를 방지하기 위해서 hard limit가 존재하는 것으로 보입니다.
  - hfile.block.cache.size와 hbase.regionserver.global.memstore.upperLimit의 합이 0.8 (80%)를 넘을 수 없게 되어 있습니다.
    이는 아마 read cache 와 memstore의 크기의 합이 전체 Heap 영역 중 대부분을 차지해 버리면
    HBase의 다른 구성 요소들이 충분한 메모리를 할당받을 수 없기 때문인 듯합니다.
  - 저희는 이 두 개의 설정 값을 각각 0.2, 0.3으로 해 놓았습니다. (20%, 30%)
- **ipc.client.tcpnodelay / ipc.server.tcpnodelay / hbase.ipc.client.tcpnodelay**
  - HDFS의 tcpnodelay 와 비슷한 설정입니다. 기본값은 전부 false입니다.
  - 이 설정을 true로 하기 전에는 Get/Put 99%, 99.9% Latency가 40ms 와 80ms 근처에 모이는 현상을 발견할 수 있었습니다.
    전체 요청의 매우 작은 부분이었지만, 평균 Get Latency가 1~2ms 내외이기 때문에 99%, 99.9% tail이 평균 Latency에 큰 영향을 미쳤습니다.
  - 이 설정을 전부 true로 바꾼 후에 평균 Latency가 절반으로 하락했습니다.
- **Heap memory / GC 설정**
  - 저희는 m2.4xlarge가 제공하는 메모리 (68.4GB)의 상당 부분을 HBase의 Read/Write cache에 할당하였습니다.
    이는 보통 사용하는 Java Heap 공간보다 훨씬 큰 크기이며 심각한 Stop-the-world GC 문제를 일으킬 수 있기 때문에,
    저희는 이 문제를 피하고자 여러 가지 설정을 실험하였습니다.
  - STW GC time을 줄이기 위해서 [Concurrent-Mark-and-sweep GC][cms gc]를 사용했습니다.
  - HBase 0.92에서부터 기본값으로 설정된 [Memstore-Local Allocation Buffer (MSLAB)][mslab] 을 사용했습니다.
    ```
    hbase.hregion.memstore.mslab.enabled = true #(default)
    ```
  - hbase-env.sh 파일을 다음과 같이 설정했습니다.
    ```
    HBASE_HEAPSIZE = 61440 #(60GB)
    HBASE_OPTS = "-XX:+UseConcMarkSweepGC -XX:CMSInitiatingOccupancyFraction=70 -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps"
    ```
  - GC log를 Python script로 Parsing해서 STW GC 시간을 관찰하고 있습니다. 지금까지 0.2초 이상의 STW GC는 한 번도 발생하지 않았습니다.

## 그 밖에 도움이 될 만한 설정들

- hbase.hregion.majorcompaction
  - HBase는 하나의 Region에 대해서 여러 개의 StoreFile을 가질 수 있습니다.
    그리고 주기적으로 성능 향상을 위해서 이 파일들을 모아서 하나의 더 큰 파일로 합치는 과정을 진행하게 됩니다.
    그리고 이 과정은 많은 CPU usage와 Disk IO를 동반합니다. 그리고 이때 반응 속도가 다소 떨어지게 됩니다.
    따라서 반응 속도가 중요한 경우에는, 이 Major compaction을 off-peak 시간대를 정해서 manual 하게 진행하시는 것이 좋습니다.
  - 저희는 사용자의 수가 상대적으로 적은 새벽 시간대에 crontab 이 실행시키는 script가 돌면서
    전체 Region에 대해서 하나하나 Major Compaction이 진행되도록 하였습니다.
  - 기본값은 86,400,000 (ms)로 되어 있는데, 이 값을 0으로 바꾸시면 주기적인 Major Compaction이 돌지 않게 할 수 있습니다.
- hbase.hregion.max.filesize
  - HBase는 하나의 Region이 크기가 특정 값 이상이 되면 자동으로 2개의 Region으로 split을 시킵니다.
    Region의 개수가 많지 않을 때는 큰 문제가 없지만, 계속해서 데이터가 쌓이게 되면 필요 이상으로 Region 수가 많아지는 문제를 나을 수 있습니다.
    Region 수가 너무 많아지면 지나친 Disk IO가 생기는 문제를 비롯한 여러 가지 안 좋은 점이 있을 수 있기 때문에, split 역시 manual 하게 하는 것이 좋습니다.
    그렇다고 Table의 Region 수가 너무 적으면 Write 속도가 떨어지거나 Hot Region 문제가 생길 수 있기 때문에 좋지 않습니다.
  - HBase 0.92.1 에서는 기본값이 1073741824(1GB)로 되어 있는데,
    저희는 이 값을 10737418240(10GB)로 늘인 후에 manual 하게 split을 하여 Region의 개수를 조정하고 있습니다.
- hbase.hregion.memstore.block.multiplier
  - memstore의 전체 크기가 multiplier \* flush size보다 크면 추가적인 Write를 막고 flush가 끝날때까지 해당 memstore는 block 됩니다.
  - 기본값은 2인데, 저희는 8로 늘려놓고 사용하고 있습니다.
- dfs.datanode.balance.bandwidthPerSec
  - 부수적인 설정이지만, HDFS의 Datanode간의 load balancing이 일어나는 속도를 제한하는 설정입니다.
    기본값은 1MB/sec로 되어 있지만, 계속해서 Datanode를 추가하거나 제거하는 경우에는 기본값으로는 너무 느릴 때가 있습니다.
    저희는 10MB/sec 정도로 늘려서 사용하고 있습니다.
- dfs.namenode.heartbeat.recheck-interval
  - HDFS namenode에만 해당되는 설정입니다.
  - Datanode가 응답이 없는 경우에 얼마 후에 Hadoop cluster로부터 제거할 것인지를 나타내는 값입니다.
  - 실제로 응답이 없는 Datanode가 떨어져 나가기까지는 10번의 heartbeat가 연속해서 실패하고 2번의 recheck역시 실패해야 합니다.
    Heartbeat interval이 기본값인 3초라고 하면, 30초 + 2 \* recheck-interval 후에 문제가 있는 Datanode가 제거되는 것입니다.
  - 기본값이 5분으로 되어 있는데, fail-over가 늦어지기 때문에 사용하기에는 너무 큰 값입니다.
    저희는 문제가 있는 Datanode가 1분 후에 떨어져 나갈 수 있도록 이 값을 15,000 (ms) 으로 잡았습니다.
- Read short-circuit
  - RegionServer가 로컬 Datanode로부터 block을 읽어올 때 Datanode를 통하지 않고 Disk로부터 바로 읽어올 수 있게 하는 설정입니다.
  - 데이터의 양이 많아서 Cache hit이 낮아 데이터 대부분을 디스크에서 읽어와야 할 때 효율적입니다.
    Cache hit에 실패하는 Read의 Throughput이 대략 2배로 좋아지는 것을 확인할 수 있습니다.
    OLAP용 HBase에는 매우 중요한 설정이 될 수 있습니다.
  - 하지만 HBase 0.92.1-cdh4.0.1까지는 일부 Region이 checksum에 실패하면서 Major compaction이 되지 않는 버그가 있었습니다.
    현재 이 문제가 해결되었는지 확실하지 않기 때문에 확인되기 전에는 쓰는 것을 추천하지는 않습니다.
  - 설정하는 방법은 다음과 같습니다.
  ```
  dfs.client.read.shortcircuit = true #(hdfs-site.xml) 
  dfs.block.local-path-access.user = hbase #(hdfs-site.xml)
  dfs.datanode.data.dir.perm = 775 #(hdfs-site.xml)
  fs.client.read.shortcircuit = true #(hbase-site.xml)
  ```

- [Bloom filter]
  - [Bloom filter의 작동방식에 대해 시각적으로 잘 표현된 데모 페이지][bloom filter example]
  - HBase는 [Log-structured-merge tree]를 사용하는데, 하나의 Region에 대해서 여러 개의 파일에 서로 다른 version의 값들이 저장되어 있을 수 있습니다.
    Bloom filter는 이때 모든 파일을 디스크에서 읽어들이지 않고 원하는 값이 저장된 파일만 읽어들일 수 있게 함으로써 Read 속도를 빠르게 만들 수 있습니다.
  - Table 단위로 Bloom filter를 설정해줄 수 있습니다.
  - ROW와 ROWCOL의 두 가지 옵션이 있는데, 전자는 Row key로만 filter를 만드는 것이고, 후자는 Row+Column key로 filter를 만드는 것입니다.
    Table Schema에 따라 더 적합한 설정이 다를 수 있습니다.
  - 저희는 데이터 대부분이 메모리에 Cache 되고 하나의 Region에 대해서 여러 개의 StoreFile이 생기기 전에
    compaction을 통해서 하나의 큰 파일로 합치는 작업을 진행하기 때문에, 해당 설정을 사용하지 않고 있습니다.

## 결론

지금까지 저희가 비트윈을 운영하면서 얻은 경험을 토대로 HBase 최적화 설정법을 정리하였습니다.
하지만 위의 구성은 어디까지나 비트윈 서비스에 최적화되어 있는 설정이며, HBase의 사용 목적에 따라서 달라질 수 있음을 말씀드리고 싶습니다.
그래서 단순히 설정값을 나열하기보다는 해당 설정이 어떤 기능을 하는 것인지 저희가 아는 한도 내에서 설명드리려고 하였습니다.
위의 글에서 궁금한 점이나 잘못된 부분이 있으면 언제든지 답글로 달아주시길 바랍니다. 감사합니다.

[비트윈]: http://between.us/
[hbase]: http://hbase.apache.org/
[bigtable]: http://research.google.com/archive/bigtable.html
[cloudera]: http://www.cloudera.com/content/cloudera/en/home.html
[vcnc]: http://between.us/team/
[oltp]: http://en.wikipedia.org/wiki/Online_transaction_processing
[olap]: http://en.wikipedia.org/wiki/Online_analytical_processing
[nhn line]: http://tech.naver.jp/blog/?p=1420
[facebook messenger]: http://highscalability.com/blog/2010/11/16/facebooks-new-real-time-messaging-system-hbase-to-store-135.html
[hbase configuration]: http://hbase.apache.org/book/important_configurations.html
[aws ec2]: http://aws.amazon.com/ko/ec2/instance-types/
[cms gc]: http://helloworld.naver.com/helloworld/1329
[mslab]: http://blog.cloudera.com/blog/2011/02/avoiding-full-gcs-in-hbase-with-memstore-local-allocation-buffers-part-1/
[spof]: http://en.wikipedia.org/wiki/Single_point_of_failure
[bloom filter]: http://en.wikipedia.org/wiki/Bloom_filter
[bloom filter example]: http://www.jasondavies.com/bloomfilter/
[log-structured-merge tree]: http://en.wikipedia.org/wiki/Log-structured_merge-tree
[nagle's algorithm]: http://en.wikipedia.org/wiki/Nagle's_algorithm
[quorum journaling node]: http://blog.cloudera.com/blog/2012/10/quorum-based-journaling-in-cdh4-1/
