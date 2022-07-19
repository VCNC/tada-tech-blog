# 게시물 작성 방법
기술 블로그 게시물 작성은 마크다운을 기본으로 합니다.

## yaml 메타 데이터에 대한 설명

기본적으로 yaml메타데이터는 아래와 같이 이루어 집니다. 각 필드에 대해 설명합니다.

    layout: post
    date: 2012-06-26 10:00:00 +09:00
    permalink: /2012/06/nosql-is-not-useful/

    title: "NoSQL은 생각보다 쓸만하지 않다."
    description:
      NoSQL이라고 일컫는 분산 데이터베이스들이 요즘 트렌드다. 뛰어난 확장성과 가용성으로 각광을 받고 있다.
      실제로 여러 소셜게임업체들이 NoSQL을 사용하며, 넷플릭스 또한 NoSQL인 Hbase와 Cassandra를 주요 저장소로 사용한다.
      그리고 페이스북의 메신저 시스템 및 실시간 분석 시스템 또한 HBase기반으로 만들어졌다.
      NoSQL을 사용하면 RDBMS에서의 불편한 것들이 모두 해결되고 높은 확장성을 가진 시스템을 구축할 수 있는 것 같지만 현실은 그렇지 못하다.
      대부분의 서비스들은 NoSQL을 제대로 사용하지 못하고 있다.
    image: /images/2012/06/Screen-Shot-2012-02-10-at-오전-1.55.27.png
    tags: ["nosql", "hbase", "facebook", "twitter", "rdbms"]

    author:
      name: "Jung-Haeng Lee"
      facebook: https://www.facebook.com/eincs
      twitter: https://twitter.com/eincs
      google: https://plus.google.com/u/0/117656116840561651263/posts
      link: http://eincs.net

- layout: 기본적으로 post로 입력합니다.
- date: 해당 글의 발행 날짜입니다. 무조건 오전 10시로 해주세요.
- permalink: 해당 글의 [Permalink]입니다. 기본적인 Permalink 룰을 반드시 지킬 수 있도록 합시다.
- title: 글에 대한 제목입니다.
- description: 글의 대략적인 설명입니다. SEO상 매우 중요합니다.
  - 기본적으로 글에서 중요한 키워드가 모두 포함되고 반복되도록 하는 것이 좋습니다.
  - 페이스북 및 트위터에 공유시 미리보기에 나오는 요약 글입니다.
  - 잘 모르겠으면 글을 요약하거나 글의 처음 문단을 넣읍시다.
- image: 글의 대표 사진입니다.
  - 페이스북 및 트위터에 공유하였을때 나오게 됩니다.
- tags: 글의 중요 키워드 입니다. SEO에 매우 중요합니다.
- author.name: 작성자 이름입니다.
- author.facebook: 작성자 페이스북 주소 입니다. 적고 싶지 않으면 적지 않으셔도 됩니다.
- author.twitter: 작성자 페이스북 주소 입니다. 적고 싶지 않으면 적지 않으셔도 됩니다.
- author.google: 작성자 구글 플러스 주소 입니다. 적고 싶지 않으면 적지 않으셔도 됩니다.
  - 적는다면, 구글 검색시 구글 플러스 프로필에 옆에 나오도록 설정할 수 있습니다.
- author.link: 글 상단에서 작성자 이름을 클릭했을때 이동할 링크입니다.
  - 적고 싶지 않으면 적지 않으셔도 됩니다.
  - 자기 블로그나 페이스북 프로필 어느거나 적으셔도 상관 없습니다.
  - 다만 링크가 꺠지지 않도록 해주세요.