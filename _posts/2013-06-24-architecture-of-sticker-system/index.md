---
layout: post
date: 2013-06-24 10:00:00 +09:00
permalink: /2013-06-24-architecture-of-sticker-system
disqusUrl: http://engineering.vcnc.co.kr/2013/06/architecture-of-sticker-system/

title: '비트윈의 스티커 시스템 구현 이야기'
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
description: 비트윈에는 커플들이 서로에게 감정을 더욱 잘 표현할 수 있도록 스티커를 전송할 수 있는 기능이 있습니다.
  이를 위해 스티커 스토어에서 다양한 종류의 스티커를 제공하고 있으며 사용자들은 구매한 스티커를 메시지의 첨부파일 형태로 전송을 할 수 있습니다.
  저희가 스티커 시스템을 구현하면서 맞딱드린 문제와 이를 해결한 방법에 대해 소개해 보고자 합니다.

tags: ['VCNC', '비트윈', 'Between', '스티커', 'Sticker', 'Jersey', 'Closore Template', 'GAE', 'WebP']

authors:
  - name: 'James Lee'
    facebook: https://www.facebook.com/eincs
    twitter: https://twitter.com/eincs
    google: https://plus.google.com/u/0/117656116840561651263/posts
    link: http://eincs.com
---

비트윈에는 커플들이 서로에게 감정을 더욱 잘 표현할 수 있도록 스티커를 전송할 수 있는 기능이 있습니다.
이를 위해 스티커 스토어에서 다양한 종류의 스티커를 제공하고 있으며 사용자들은 구매한 스티커를 메시지의 첨부파일 형태로 전송을 할 수 있습니다.
저희가 스티커 시스템을 구현하면서 맞딱드린 문제와 이를 해결한 방법, 그리고 프로젝트를 진행하면서 배운 것들에 대해 소개해 보고자 합니다.

## 스티커 시스템 아키텍처

비트윈에서 스티커 기능을 제공하기 위해 다양한 구성 요소들이 있습니다. 전체적인 구성은 다음과 같습니다.

- **[비트윈 서버]**: [이전에 소개드렸었던 비트윈의 서버][비트윈 서버]입니다. 비트윈의 채팅, 사진, 기념일 공유 등 제품내의 핵심이 되는 기능을 위해 운영됩니다.
  스티커 스토어에서 구매한 스티커는 비트윈 서버를 통해 상대방에게 전송할 수 있습니다.
- **스티커 스토어 서버**: 스티커를 구매할 수 있는 스토어를 서비스합니다.
  스티커 스토어는 **웹페이지로 작성**되어 있고 아이폰, 안드로이드 클라이언트와 **유기적으로 연동**되어 구매 요청 등을 처리합니다.
  처음에는 [Python]과 [Flask]를 이용하여 구현하려 하였으나 결국엔 **서버 개발자들이 좀 더 익숙한 자바로 구현**하기로 결정하였습니다.
  [Jetty]와 [Jersey]를 사용하였고, HTML을 랜더링하기 위한 템플릿 엔진으로는 [Closure Template]을 이용하였습니다.
  ORM으로는 [Hibernate]/[JPA], 클라이언트와 웹페이지간 연동을 위해서 [Cordova]를 이용하였습니다.
  [EC2]에서 운영하고 있으며 데이터베이스로는 [RDS]에서 제공하는 MySQL을 사용합니다.
  **이미 존재하는 솔루션들을 잘 활용**하여 최대한 빨리 개발 할 수 있도록 노력을 기울였습니다.
- **스티커 다운로드 서버**: 스티커는 비트윈에서 정의한 특수한 포맷의 파일 형태로 제공됩니다. 기본적으로 수 많은 사용자가 같은 스티커 파일을 다운로드 받습니다.
  따라서 [AWS]에서 제공하는 [CDN]인 [CloudFront]을 이용하며, 실제 스티커 파일들은 [S3]에서 호스팅합니다.
  그런데 스티커 파일들은 디바이스의 해상도([DPI])에 따라 최적화된 파일들을 내려줘야하는 이슈가 있었습니다.
  이를 위해 CloudFront와 S3사이의 파일 전송에 [GAE]에서 운영중인 간단한 어플리케이션이 관여합니다.
  이에 대해서는 뒷편에서 좀 더 자세히 설명하도록 하겠습니다.

## 구현상 문제들과 해결 방법들

### 적정 기술에 대해 고민하다

스티커 스토어 서버를 처음 설계할때 [Flask]와 [SQLAlchemy]를 이용하여 구현하고자 하였습니다.
개발팀 내부적으로 웹서버를 만들때 앞으로 Python과 Flask를 이용해야겠다는 생각이 있었기 때문이며,
일반적으로 Java보다는 [Python]으로 짜는 것이 개발 효율이 더 좋다는 것은 잘 알려진 사실이기도 합니다.
하지만 Java에 익숙한 서버 개발자들이 Python의 일반적인 스타일에 익숙하지 않아 Python다운 코드를 짜기 어려웠고, 오히려 개발하는데 비용이 더 많이 들어갔습니다.
그래서 개발 중에 다시 웹 서버는 자바로 짜게 되었고, 여러가지 스크립트들만 Python으로 짜고 있습니다.
실제 개발에 있어서 **적절한 기술의 선택은 실제 프로젝트에 참여하는 개발자들의 능력에 따라 달라져야**한다는 것을 알게되었습니다.

### 스티커 파일 용량과 변환 시간을 고려하다

사용자는 스티커 스토어에서 여러개의 스티커가 하나로 묶인 스티커 묶음을 구매하게 됩니다. 구매 완료시 여러개의 스티커가 하나의 파일로 압축되어 있는 zip파일을 다운로드 받게 됩니다.
zip파일내의 각 스티커 파일에는 스티커를 재생하기 위한 스티커의 이미지 프레임들과 메타데이터에 대한 정보들이 담겨 있습니다. 메타데이터는 [Thrift]를 이용하여 정의하였습니다.

![StickerFormat]

<figcaption>스티커 zip파일 안에는 여러개의  스티커 파일이 들어가 있으며, 스티커 파일은 다양한 정보를 포함합니다</figcaption>

카카오톡의 스티커의 경우 애니메이션이 있는 것은 배경이 불투명하고 배경이 투명한 경우에는 애니메이션이 없습니다.
하지만 비트윈 스티커는 **배경이 투명하고 고해상도의 애니메이션**을 보여줄 수 있어야 했습니다.
배경이 투명한 여러 장의 고해상도 이미지를 움직이게 만드는 것은 비교적 어려운 점이 많습니다.
여러 프레임의 이미지들의 배경을 투명하게 하기 위해 [PNG]를 사용하면 [JPEG]에 비해 스티커 파일의 크기가 너무 커집니다.
파일 크기가 너무 커지면 당시 3G 환경에서 다운로드가 너무 오래 걸려 사용성이 크게 떨어지기 때문에 무작정 PNG를 사용할 수는 없었습니다.
이에 대한 해결책으로 **투명 기능을 제공하면서도 파일 크기도 비교적 작은 [WebP]** 를 이용하였습니다.
WebP는 구글이 공개한 이미지 포맷으로 화질 저하를 최소화 하면서도 이미지 파일 크기가 작다는 장점이 있습니다.
각 클라이언트에서 스티커를 다운 받을때는 WebP로 다운 받지만, 다운 받은 이후에는 이미지 로딩 속도를 위해 로컬에 PNG로 변환한 스티커 프레임들을 캐싱합니다.

그런데 출시 된지 오래된 안드로이드나 iPhone 3Gs와 같이 CPU성능이 좋지 않은 단말에서 WebP 디코딩이 지나치게 오래 걸리는 문제가 있었습니다.
이런 단말들은 공통적으로 해상도가 낮은 디바이스였고, 이 경우에는 특별히 PNG로 스티커 파일을 만들어 내려줬습니다.
이미지의 **해상도가 낮기 때문에 파일 크기가 크지 않았고**, 다운로드 속도 문제가 없었기 때문입니다.

### 좀 더 나은 주소 포맷을 위해 GAE를 활용하다

기본적으로 스티커는 여러 사용자가 같은 스티커 파일을 다운받아 사용하기 때문에 [CDN]을 이용하여 배포하는 것이 좋습니다.
CDN을 이용하면 스티커 파일이 전 세계 곳곳에 있는 엣지 서버에 캐싱되어 사용자들이 가장 최적의 경로로 파일을 다운로드 받을 수 있습니다.
그래서 [AWS]의 [S3]와 [CloudFront]를 사용하여 스티커 파일을 배포하려고 했습니다. 또한, **여러 해상도의 디바이스에서 최적의 스티커**를 보여줘야 했습니다.
이 때문에 다양한 해상도로 만들어진 스티커 파일들을 S3에 올려야 했는데 클라이어트에서 스티커 파일을 다운로드시 주소 포맷을 어떻게 가져가야 할지가 어려웠습니다.
S3에 올리는 경우 파일와 디렉터리 구조 형태로 저장되기 때문에 아래와 같은 방법으로 저장이 가능합니다.

> http://dl.sticker.vcnc.co.kr/[dpi_of_sticker]/[sticker_id].sticker

하지만, 이렇게 주소를 가져가는 경우 **클라이언트가 자신의 해상도에 맞는 적절한 스티커의 해상도를 계산하여 요청**해야 합니다.
이것은 클라이언트에서 서버에서 제공하는 스티커 해상도 리스트를 알고 있어야 한다는 의미이며, **이러한 정보들은 최대한 클라이언트에 가려 놓는 것이 유지보수에 좋습니다**.
클라이언트는 그냥 자신의 디스플레이 해상도를 전달하기만 하고, 서버에서 적절히 계산하여 알맞은 해상도의 스티커 파일을 내려주는 것이 가장 좋습니다.
이를 위해 스티커 다운로드 URL을 아래와 같은 형태로 디자인하고자 하였습니다.

> http://dl.sticker.vcnc.co.kr/[sticker_id].sticker?density=[dpi_of_device]

하지만 S3와 CloudFront 조합으로만 위와 같은 URL 제공은 불가능하며 따로 다운로드 서버를 운영해야 합니다.
그렇다고 EC2에 따로 서버를 운영하는 것은 **안정적인 서비스 운영을 위해 신경써야할 포인트들이 늘어나는 것**이어서 부담이 너무 컸습니다.
그래서, 아래와 같이 [GAE]를 사용하기로 하였습니다.

![StickerDownloadServer]

[GAE]는 구글에서 일종의 클라우드 서비스([PaaS])로 구글 인프라에서 웹 어플리케이션을 실행시켜 줍니다.
GAE에 클라이언트에서 요청한 URL을 적절한 S3 URL로 변환 해주는 어플리케이션을 만들어 올렸습니다. 일종의 **[Rewrite Engine]** 역할을 하는 것입니다.
서비스의 안정성은 GAE가 보장해주고, S3와 CloudFront의 안정성은 AWS에서 보장해주기 때문에 크게 신경쓰지 않아도 장애 없는 서비스 운영이 가능합니다.
또한 CloudFront에서 스티커 파일을 최대한 캐싱 하며 따라서 GAE를 통해 새로 요청을 하는 경우는 거의 없기 때문에 GAE 사용 비용은 거의 발생하지 않습니다.
GAE에는 클라이언트에서 보내주는 해상도를 보고 적당한 해상도의 스티커 파일을 내려주는 아주 간단한 어플리케이션만 작성하면 되기 때문에 개발 비용도 거의 들지 않았습니다.

### 토큰을 이용해 보안 문제를 해결하다

실제 스티커를 구매한 사용자만 스티커를 사용할 수 있어야 합니다. 스티커 토큰을 이용해 실제 구매한 사용자만 스티커를 전송할 수 있도록 구현하였습니다.
사용자가 스티커 스토어에서 스티커를 구매하게 되면 각 스티커에 대한 토큰을 얻을 수 있습니다. 스티커 토큰은 다음과 같이 구성됩니다.

> 토큰 버전, 스티커 아이디, 사용자 아이디, 유효기간, 서버의 서명

서버의 서명은 앞의 네 가지 정보를 바탕으로 만들어지며 서버의 서명과 서명을 만드는 비밀키는 충분히 길어서 실제 비밀키를 알지 못하면 서명을 위조할 수 없습니다.
사용자가 자신이 가지고 있는 스티커 토큰과 그에 해당하는 스티커를 비트윈 서버로 보내게 되면, 비트윈 서버에서는 서명이 유효한지 아닌지를 검사합니다.
서명이 유효하다면 스티커를 전송이 성공하며, 만약 토큰이 유효하지 않다면 스티커의 전송을 허가하지 않습니다.

## 못다 한 이야기

비트윈 개발팀에게 스티커 기능은 개발하면서 우여곡절이 참 많았던 프로젝트 중에 하나 입니다. 여러 가지 시도를 하면서 실패도 많이 했었고 덕분에 배운 것도 참 많았습니다.
기술적으로 크게 틀리지 않다면, 빠른 개발을 위해서 가장 익숙한 것으로 개발하는 것이 가장 좋은 선택이라는 알게 되어 스티커 스토어를 Python 대신 Java로 구현하게 되었습니다.
현재 비트윈 개발팀에서 일부 웹사이트와 스크립트 작성 용도로 Python을 사용하고 있지만 Python을 잘하는 개발자가 있다면 다양한 프로젝트들를 Python으로 진행할 수 있다고 생각합니다.
팀내에 경험을 공유할 수 있는 사람이 있다면 피드백을 통해 좋은 코드를 빠른 시간안에 짤 수 있고 뛰어난 개발자는 언어와 상관없이 컴퓨터에 대한 깊이 있는 지식을 가지고 있을 것이기 때문입니다.

네 그렇습니다. 결론은 Python 개발자를 모신다는 것입니다.

[비트윈 서버]: http://engineering.vcnc.co.kr/2013/04/between-system-architecture/
[통계 서버]: http://engineering.vcnc.co.kr/2013/05/analyzing-user-data/
[python]: http://www.python.org/
[flask]: http://flask.pocoo.org/
[sqlalchemy]: http://www.sqlalchemy.org/
[jetty]: http://www.eclipse.org/jetty/
[jersey]: https://jersey.java.net/
[closure template]: https://developers.google.com/closure/templates/
[hibernate]: http://www.hibernate.org/
[cordova]: http://cordova.apache.org/
[ec2]: http://aws.amazon.com/ec2/
[rds]: http://aws.amazon.com/rds/
[aws]: http://aws.amazon.com/
[cloudfront]: http://aws.amazon.com/cloudfront/
[gae]: https://developers.google.com/appengine/
[s3]: http://aws.amazon.com/s3/
[dpi]: http://en.wikipedia.org/wiki/Dots_per_inch
[webp]: https://developers.google.com/speed/webp/
[thrift]: http://thrift.apache.org/
[cdn]: https://en.wikipedia.org/wiki/Content_delivery_network
[rewrite engine]: http://en.wikipedia.org/wiki/Rewrite_engine
[jpa]: http://en.wikipedia.org/wiki/Java_Persistence_API
[paas]: http://en.wikipedia.org/wiki/Platform_as_a_service
[png]: http://en.wikipedia.org/wiki/Portable_Network_Graphics
[jpeg]: https://en.wikipedia.org/wiki/JPEG
[stickerformat]: ./architecture-of-sticker-system-sticker-format.png '스티커 파일의 포맷'
[stickerdownloadserver]: ./architecture-of-sticker-system-sticker-download-server.png '스티커 다운로드 서버 구성'