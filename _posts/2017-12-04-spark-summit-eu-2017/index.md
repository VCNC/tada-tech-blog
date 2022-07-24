---
layout: post
date: 2017-12-18 11:30:00 +09:00
permalink: /2017-12-04-spark-summit-eu-2017
disqusUrl: http://engineering.vcnc.co.kr/2017/12/spark-summit-eu-2017/

title: '비트윈 데이터팀의 Spark Summit EU 2017 참가기'
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
description: Apache Spark은 최근 가장 빠르게 성장하고 있고, 많은 사람이 사용하고 있는 빅데이터 처리 엔진입니다.
  이에 걸맞게 Spark 커뮤니티의 최대 규모 컨퍼런스인 Spark Summit은 1년에 3번 개최되며 1,000명 이상의 참석자와 100개 이상의 세션이 진행되는 큰 규모를 자랑합니다.
  비트윈 데이터팀이 이번 Spark Summit에서 스타트업에서의 적용 사례에 대해 발표할 기회가 생겨, 유럽에 다녀왔습니다.

tags:
  [
    'Apache Spark',
    '아파치 스파크',
    'Spark Summit EU 2017',
    'Big Data',
    '빅데이터',
    'Machine Learning',
    '머신러닝',
    'Deep Learning',
    '딥러닝',
  ]

authors:
  - name: 'Kevin Kim'
    facebook: https://www.facebook.com/sangwookim.me
    link: https://www.facebook.com/sangwookim.me
---

안녕하세요, 비트윈 데이터팀입니다. 오늘은 데이터 분야의 큰 행사 중 하나인 Spark Summit EU 2017에 참석하여 세션과 토론 등에 참여하고 발표도 하고 온 경험을 공유해 보려고 합니다.

![Spark Summit EU 2017][spark summit logo]

## Apache Spark, 그리고 Spark Summit 컨퍼런스

**[Apache Spark][apache spark]은 최근 가장 빠르게 성장하고 있고, 많은 사람이 사용하고 있는 빅데이터 처리 엔진**입니다.
15,000개의 Github Star, 1100명의 contributor 수만 보더라도 얼마나 핫한 프로젝트인지 느낄 수 있습니다. (참고로, 하둡은 4300개의 Github Star, 111명의 contributor를 가지고 있습니다)

이에 걸맞게 Spark 커뮤니티의 최대 규모 컨퍼런스인 [Spark Summit][spark summit] 은 1년에 3번 미국 동부, 서부 그리고 유럽에서 열리고 1,000명 이상의 참석자와 100개 이상의 세션이 진행되는 큰 규모를 자랑합니다.

비트윈 데이터팀은 Spark이 지금만큼 유명해지기 전인 2013년부터 [Spark을 잘 활용하고 있어][vcnc spark post] 많은 노하우를 가지고 있는데, 운이 좋게도 [이번 Spark Summit EU][spark summit eu 2017]에서 스타트업에서의 use case에 대해 발표할 기회가 생겨 유럽에 다녀오게 되었습니다.

잠깐 회사 자랑을 하자면, 비트윈을 만드는 VCNC 개발팀은 기술적인 리더십과 완성도를 추구하기 위해 모든 팀원이 각자 맡은 분야에 끊임없이 노력하고 있고, 회사에서도 이에 지원을 아끼지 않습니다.

이러한 활동 중 하나로 저희는 팀원들의 국내외 컨퍼런스 참석을 적극 권장하고 있습니다. 국내 컨퍼런스는 누구의 눈치도 볼 필요 없이 자유롭게 참석할 수 있고, 매년 쿼터를 정해서 적임자라고 생각하는 사람을 선정하여 여러 해외 컨퍼런스에 참석을 하고 있습니다. 또한, 앞으로 여건이 허락하는 대로 이런 기회를 늘려나갈 계획입니다.

![컨퍼런스홀][photo 1]

## Spark의 발전방향

**Apache Spark은 지금도 계속해서 빠르게 발전하고 있습니다.** 오픈소스는 여러 사람이 같이 사용하고, 여러 사람이 같이 참여하여 발전하는 기술이기에 항상 시대와 트렌드를 잘 반영합니다. Apache Spark도 최근 머신러닝, 딥러닝에 대한 사람들의 관심에 호응하여 이와 관련된 기능들이 많이 개발되고 있고 새로운 기능들이 이번 Summit에도 많이 소개되었습니다.

이번 Spark Summit 은 이틀간 Developer Day, Enterprise Day로 주제를 나누어 첫날은 기술적인 주제들에 대해 심층적으로 파고드는 세션들을 배치하고, 둘째날은 다양한 회사나 연구조직들의 여러가지 use case들에 대한 세션들을 배치하여 **기술과 활용** 두가지 부분으로 견문을 넓힐 수 있었습니다.

![Spark Summit Contents][spark summit contents]

<figcaption>기록하고 싶은 내용들이 많아서 계속해서 사진으로 남겼습니다</figcaption>

![Deeplearning Keynote][deeplearning keynote]

![Deeplearning Deep Dive][deeplearning deep dive]

특히 Spark의 딥러닝 지원은 사람들이 많이 원하고 궁금해하던 부분이었습니다. 대규모의 데이터에 머신러닝 모델을 적용해야 할 때, Spark MLlib 이 단연 좋은 대안이 되고있는데, 아쉽게도 MLlib은 복잡한 딥러닝 모델은 지원하지 않고 있습니다.

그래서 이러한 업무에서는 현재는 Spark으로 데이터를 전처리하고, 딥러닝 전용 머신으로 데이터를 옮겨서 training과 prediction을 수행하는 작업을 하곤 합니다. 하지만 데이터 처리 부분과 딥러닝 training, prediction을 위한 부분이 분리되어 있지 않고, 한번에 파이프라인을 실행할 수 있다면 무척 편하고 효율적일 것입니다.

새롭게 소개된 **Spark의 딥러닝 파이프라인**은 이부분에 초점을 맞추어 좋은 인터페이스를 만들어 내는데 성공하였습니다. ([코드도 공개되어][deep learning pipeline github] 있습니다)

Spark Summit에서는 새로운 딥러닝 파이프라인을 키노트에서 소개하였고, 그리고 딥러닝 deep dive 세션에서 더 자세한 설명과 데모를 보여주었는데 아주 매끄럽고 잘 짜여인 데모였습니다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/zom9J9sK6wY?ecver=1" frameborder="0" gesture="media" allowfullscreen></iframe>
<figcaption>21분 11초부터 데모 시작</figcaption>

우선 데이터 로드부터 처리까지 Spark으로 아주 쉽고 간편하게 할 수 있었으며, 이미지 데이터를 가지고 복잡한 딥러닝 모델을 학습시키는데에 시간과 비용이 많이 들기 때문에, **pre-train된 모델이나, 마지막 layer를 뜯어낸 모델을 쉽게 사용**할 수 있도록 한 점도 훌륭했습니다.

키노트 외에도 다른 여러 발표나, 지난번 Spark Summit 등에서 발표된 내용을 보면 커뮤니티에서도 딥러닝 데이터 파이프라인을 개선하는 것에 관심이 많고 많은 아이디어와 작업이 이루어지는 것을 볼 수 있습니다.

Data parallelism 및 Model parallelism 등 여러 방향으로 솔루션들이 제안되고 있고, 아직은 뚜렷한 정답이 없어 보이지만 1~2년 이내에 방향성이 나올 거라 생각합니다.

<iframe src="//www.slideshare.net/slideshow/embed_code/key/hrE8PNavKOeUDD?startSlide=9" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/databricks/deep-learning-and-streaming-in-apache-spark-2x-with-matei-zaharia-81232855" title="Deep Learning and Streaming in Apache Spark 2.x with Matei Zaharia" target="_blank">Deep Learning and Streaming in Apache Spark 2.x with Matei Zaharia</a> </strong> de <strong><a href="//www.slideshare.net/databricks" target="_blank">Databricks</a></strong> </div>

또한 실시간 분석을 위한 Spark Streaming의 더 발전되고 통합된 버전인 **Structured Streaming**도 비중 있게 소개가 되었습니다. 그리고 **DataFrame, DataSet** API도 계속해서 강조하고 있기 때문에 앞으로는 이 부분에 관심을 더 두는 것이 좋겠습니다.
([별도의 세션][rdd and dataframe] 에서 DataFrame API의 중요성에 대해 다루기도 하였습니다)

([Spark Summit EU 2017 발표 스케줄 및 발표영상 다시보기][spark summit eu 2017 schedule])

## 비트윈팀의 발표

Summit 둘째 날에는 **스타트업에서의 Spark 활용에 대한 케이스를 발표**할 기회를 가질 수 있었습니다. 빅데이터 분야는 스타트업이 활발하게 활동하는 경우가 비교적 드물어서, 어떤 도전과제들이 있는지, 그리고 어떻게 이를 헤쳐나가는지 다들 궁금해하는 분위기였습니다.

비트윈 데이터 팀은 하루에 약 2TB의 데이터, 2,000만명 이상의 사용자 데이터를 다루고 있습니다. 적은 인원으로 많은 일을 효율적으로 해 나가야 하기 때문에 항상 업무방식과 기술에 대해 고민하고 있습니다.

**심플하면서도 최고의 효율성을 가진 도구들을 고집**하고, **데이터는 되도록 Raw한 상태로 보관하여 관리비용을 줄이며**, 데이터를 보며 고민하거나 여러 팀과 **이야기하는 시간을 되도록 많이 갖는 것**이 저희가 일하는 방식의 핵심입니다.

저희의 발표 자료는 아래쪽에 첨부합니다. (Spark Summit을 준비하면서 비슷한 내용으로 '데이터야놀자'에서 발표한 한글 자료도 있으니 이쪽도 같이 참고해 주세요. - [비트윈 데이터팀의 하루][datayanolja])

<div style="margin: 10px 0 30px; position: relative; width: 100%; padding-bottom: 56.3%; border-radius: 6px;">
<iframe class="speakerdeck-iframe" src="//speakerdeck.com/player/122165a0a3064134abc8b1279b64815b?" title="null" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" style="position: absolute; width: 100%; height: 100%;"></iframe>
</div>

<figcaption>영어로 발표를 하느라 무척 힘들었습니다</figcaption>

## 활발한 토론문화

컨퍼런스의 세션과 키노트도 좋았지만, 또 하나 인상 깊었던 것이 컨퍼런스 참가자들과의 정보 교환과 토론이었습니다. 컨퍼런스 첫날 저녁에 Spark meetup과 VIP파티가 열렸는데, 이곳에서 많은 사람을 만날 수 있었습니다. 특히 발표자들과는 큰 무대에서 곧 발표를 해야 한다는 압박감(?)을 공유하고 있어 금방 친해지고, 다양한 이야기를 나눌 수 있었습니다.
식사 자리에서도 옆 사람과 아주 자연스럽게 서로의 하는 일에 대해 이야기하고, 질문을 주고받으며 지식과 경험을 공유할 수 있었습니다.

## 컨퍼런스를 마치고

![Foods][foods]

<figcaption>간식이 무척 맛있었습니다</figcaption>

![Conference Hall][conference hall]

<figcaption>생각없이 찍었는데 외국인이 먹방을...</figcaption>

짧은 기간 동안 유럽의 정서를 다 알게 되지는 못하였지만 컨퍼런스장에서 **다양한 국가와 인종의 사람들이 여러 언어로 서로 소통**하는 모습은 많은 것을 깨닫기에 충분하였습니다. 함께 고민하고 서로 소통하는 문화적 토대에서 유럽의 과학과 기술이 발전해왔을 거라 생각하면서, 우리는 어떻게 해야 할까 하는 고민거리를 들고 왔습니다.

![Pub 1][pub 1]

<figcaption>The Temple Bar</figcaption>

![Pub 2][pub 2]

<figcaption>펍에서 우연히 만난 제 발표를 들은 유럽 친구들</figcaption>

마지막으로 낮선 곳에서의 짧은 여행도 해외 컨퍼런스를 참여하는 데 즐거움 중에 하나일 것입니다. 발표 준비 때문에 아일랜드를 충분히 즐기지는 못하였지만, 컨퍼런스 마지막 날 모든 일정이 끝나고 이동네의 명물인 전통 아이리쉬 펍을 찾았습니다. 다음날 새벽같이 복귀해야 했지만 남은 몇시간동안 음악을 즐기고 낯선 사람들과 포옹을 하고 웃고 떠들며 아일랜드 인이 되어 보았던, 색다르고 즐거운 경험이었습니다.

> 비트윈 데이터팀에서는 유능한 데이터 분석가를 모시고 있습니다. jobs@vcnc.co.kr로 자유롭게 자기 소개나 이력서 등을 보내주시기 바랍니다!

[spark summit]: https://spark-summit.org
[spark summit eu 2017]: https://spark-summit.org/eu-2017/
[spark summit eu 2017 schedule]: https://spark-summit.org/eu-2017/schedule/
[rdd and dataframe]: https://databricks.com/session/tale-three-apache-spark-apis-rdds-dataframes-datasets
[apache spark]: https://spark.apache.org/
[spark logo]: ./spark-logo-trademark.png
[spark summit logo]: ./spark-summit-logo.jpg
[photo 1]: ./20171025_085749.jpg
[spark summit contents]: ./spark-summit-contents.png
[deeplearning keynote]: ./deeplearning-keynote.jpg
[deeplearning deep dive]: ./deeplearning-deepdive.jpg
[deep learning pipeline github]: https://github.com/databricks/spark-deep-learning
[foods]: ./foods.jpg
[conference hall]: ./conference-hall.jpg
[presentation]: ./presentation.jpg
[pub 1]: ./pub1.jpg
[pub 2]: ./pub2.jpg
[vcnc spark post]: /2015-05-18-data-analysis-with-spark/
[datayanolja]: https://speakerdeck.com/swkimme/biteuwin-deiteotimyi-haru
