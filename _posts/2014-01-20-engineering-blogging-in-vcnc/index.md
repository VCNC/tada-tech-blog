---
layout: post
date: 2014-01-20 10:00:00 +09:00
permalink: /2014-01-20-engineering-blogging-in-vcnc
disqusUrl: http://engineering.vcnc.co.kr/2014/01/engineering-blogging-in-vcnc/

title: '블로그 운영 방법에서 엿보는 VCNC의 개발문화'
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
description:
  VCNC에서 엔지니어링 블로그를 시작하고 벌써 새로운 해를 맞이하였습니다. 그동안 여러 글을 통해 VCNC 개발팀의 이야기를 들려드렸습니다.
  이번에는 엔지니어링 블로그 자체를 주제로 글을 적어보고자 합니다. 저희는 워드프레스나 텀블러와 같은 일반적인 블로깅 도구나 서비스를 사용하지 않고
  조금은 개발자스럽다고 할 수 있는 특이한 방법으로 엔지니어링 블로그를 운영하고 있습니다. 이 글에서는 VCNC 개발팀이 엔지니어링 블로그를 운영하기 위해 이용하는 방법들을 소개하고자 합니다.
  그리고 블로그를 운영하기 위해 방법을 다루는 중간중간에 개발팀의 문화와 일하는 방식들에 대해서도 간략하게나마 이야기해보고자 합니다.

tags: ['VCNC', '비트윈', 'Between', '개발팀', '개발문화', 'JIRA', 'Stash', 'Jekyll', 'Sprint']

authors:
  - name: 'James Lee'
    facebook: https://www.facebook.com/eincs
    twitter: https://twitter.com/eincs
    google: https://plus.google.com/u/0/117656116840561651263/posts
    link: http://eincs.com
---

VCNC에서 [엔지니어링 블로그를 시작][helloworldengineeringblog]하고 벌써 새로운 해를 맞이하였습니다.
그동안 여러 글을 통해 VCNC 개발팀의 이야기를 들려드렸습니다. 이번에는 엔지니어링 블로그 자체를 주제로 글을 적어보고자 합니다.
저희는 [워드프레스][wordpress]나 [텀블러][tumblr]와 같은 일반적인 블로깅 도구나 서비스를 사용하지 않고
조금은 개발자스럽다고 할 수 있는 특이한 방법으로 엔지니어링 블로그를 운영하고 있습니다.
이 글에서는 VCNC 개발팀이 엔지니어링 블로그를 운영하기 위해 이용하는 방법들을 소개하고자 합니다.
그리고 블로그를 운영하기 위해 방법을 다루는 중간중간에 개발팀의 문화와 일하는 방식들에 대해서도 간략하게나마 이야기해보고자 합니다.

## 블로그에 사용하는 기술들

- **[Jekyll]**: Jekyll은 블로그에 특화된 정적 사이트 생성기입니다.
  [GitHub]의 Co-founder 중 한 명인 [Tom Preston-Werner]가 만들었으며 Ruby로 작성되어 있습니다.
  [Markdown]을 이용하여 글을 작성하면 [Liquid] 템플릿 엔진을 통해 정적인 HTML 파일들을 만들어 줍니다.
  VCNC 엔지니어링 블로그는 워드프레스같은 블로깅 도구를 사용하지 않고 Jekyll을 사용하고 있습니다.
- **[Bootstrap]**: 블로그 테마는 트위터에서 만든 프론트엔드 프레임워크인 Bootstrap을 이용하여 직접 작성되었습니다.
  Bootstrap에서 제공하는 다양한 기능들을 가져다 써서 블로그를 쉽게 만들기 위해 이용하였습니다.
  덕분에 큰 공을 들이지 않고도 [Responsive Web Design]을 적용할 수 있었습니다.
- **[S3]**: S3는 AWS에서 제공되는 클라우드 스토리지 서비스로서 높은 가용성을 보장합니다.
  일반적으로 파일을 저장하는 데 사용되지만, [정적인 HTML을 업로드하여 사이트를 호스팅][hostingons3]하는데 사용할 수도 있습니다.
  아마존의 CTO인 Werner Vogels 또한 [자신의 블로그][allthingsdistributed]를 S3에서 호스팅하고 있습니다.
  VCNC Engineering Blog도 Jekyll로 만들어진 HTML 파일들을 아마존의 S3에 업로드 하여 운영됩니다.
  일단 S3에 올려두면 운영적인 부분에 대한 부담이 많이 사라지기 때문에 S3에 올리기로 하였습니다.
- **[CloudFront]**: 브라우저에서 웹페이지가 보이는 속도를 빠르게 하려고 아마존의 CDN서비스인 CloudFront를 이용합니다.
  CDN을 이용하면 HTML파일들이 전 세계 곳곳에 있는 Edge 서버에 캐싱 되어 방문자들이 가장 가까운 Edge를 통해 사이트를 로딩하도록 할 수 있습니다.
  특히 CloudFront에 한국 Edge가 생긴 이후에는 한국에서의 응답속도가 매우 좋아졌습니다.
- **[s3cmd]**: s3cmd는 S3를 위한 커맨드 라인 도구입니다. 파일들을 업로드하거나 다운로드 받는 등 S3를 위해 다양한 명령어를 제공합니다.
  저희는 블로그 글을 s3로 업로드하여 배포하기 위해 s3cmd를 사용합니다.
  배포 스크립트를 실행하는 것만으로 s3업로드와 CloudFront invalidation이 자동으로 이루어지므로 배포 비용을 크게 줄일 수 있었습니다.
- **[htmlcompressor]**: 정적 파일들이나 블로그 글 페이지들을 s3에 배포할 때에는 whitespace 등을 제거하기 위해 htmlcompressor를 사용합니다.
  또한 Google [Closure Compiler]를 이용하여 javascript의 길이도 줄이고 있습니다.
  실제로 서버가 내려줘야 할 데이터의 크기가 줄어들게 되므로 로딩속도를 조금 더 빠르게 할 수 있습니다.

## 블로그 관리 방법

앞서 소개해 드린 기술들 외에도 블로그 글을 관리하기 위해 다소 독특한 방법을 사용합니다.
개발팀의 여러 팀원이 블로그에 올릴 주제를 결정하고 서로의 의견을 교환하기 위해 여러 가지 도구를 이용하는데 이를 소개하고자 합니다.
이 도구들은 개발팀이 일할 때에도 활용되고 있습니다.

### 글감 관리를 위해 JIRA를 사용하다.

**[JIRA]** 는 [Atlassian]에서 만든 이슈 관리 및 프로젝트 관리 도구입니다.
VCNC 개발팀에서는 비트윈과 관련된 다양한 프로젝트들의 이슈 관리를 위해 JIRA를 적극적으로 활용하고 있습니다.
제품에 대한 요구사항이 생기면 일단 백로그에 넣어 두고, 3주에 한 번씩 있는 스프린트 회의에서 요구사항에 대한 우선순위를 결정합니다.
그 후 개발자가 직접 개발 기간을 산정한 후에, 스프린트에 포함할지를 결정합니다.
이렇게 개발팀이 **개발에 집중할 수 있는 환경을 가질 수 있도록 하며,
제품의 전체적인 방향성을 잃지 않고 모두가 같은 방향을 향해 달릴 수 있도록** 하고 있습니다.

![JiraResolveChart]

<figcaption>VCNC 개발팀이 스프린트에 등록된 이슈를 얼마나 빨리 해결해 나가고 있는지 보여주는 JIRA의 차트.<br>
조금만 생각해보시면 어느 부분이 스프린트의 시작이고 어느 부분이 끝 부분인지 아실 수 있습니다.</figcaption>

위와 같은 프로젝트 관리를 위한 일반적인 용도 외에도 **엔지니어링 블로그 글 관리를 위해 JIRA를 사용**하고 있습니다.
JIRA에 엔지니어링 블로그 글감을 위한 프로젝트를 만들어 두고 블로그 글에 대한 아이디어가 생각나면 이슈로 등록할 수 있게 하고 있습니다.
누구나 글감 이슈를 등록할 수 있으며 필요한 경우에는 다른 사람에게 글감 이슈를 할당할 수도 있습니다.
일단 글감이 등록되면 엔지니어링 블로그에 쓰면 좋을지 어떤 내용이 포함되면 좋을지 댓글을 통해 토론하기도 합니다.
글을 작성하기 시작하면 해당 이슈를 진행 중으로 바꾸고, 리뷰 후, 글이 발행되면 이슈를 해결한 것으로 표시하는 식으로 JIRA를 이용합니다.
누구나 글감을 제안할 수 있게 하고, 이에 대해 팀원들과 토론을 하여 더 좋은 글을 쓸 수 있도록 돕기 위해 JIRA를 활용하고 있습니다.

![BlogPostIssues]

<figcaption>JIRA에 등록된 블로그 글 주제들 중 아직 쓰여지지 않은 것들을 보여주는 이슈들.<br>
아직 제안 단계인 것도 있지만, 많은 주제들이 블로그 글로 발행되길 기다리고 있습니다.</figcaption>

### 글 리뷰를 위해 Pull-request를 이용하다.

**[Stash]** 는 Attlassian에서 만든 [Git]저장소 관리 도구입니다. [GitHub Enterprise]와 유사한 기능들을 제공합니다.
Jekyll로 블로그를 운영하는 경우 이미지를 제외한 대부분 콘텐츠는 평문(Plain text)으로 관리 할 수 있게 됩니다.
따라서 VCNC 개발팀이 가장 자주 사용하는 도구 중 하나인 Git을 이용하면 별다른 시스템의 도움 없이도 모든 변경 내역과 누가 변경을 했는지 이력을 완벽하게 보존할 수 있습니다.
저희는 이런 이유로 **Git을 이용하여 작성된 글에 대한 변경 이력을 관리**하고 있습니다.

또한 Stash에서는 GitHub와 같은 Pull request 기능을 제공합니다.
Pull request는 자신이 작성한 코드를 다른 사람에게 리뷰하고 메인 브랜치에 머지해 달라고 요청할 수 있는 기능입니다.
저희는 Pull request를 활용하여 상호간 코드 리뷰를 하고 있습니다.
코드 리뷰를 통해 실수를 줄이고 개발자 간 의견 교환을 통해 더 좋은 코드를 작성하며 서로 간 코드에 대해 더 잘 이해하도록 노력하고 있습니다.
새로운 개발자가 코드를 상세히 모른다 해도 좀 더 적극적으로 코드를 짤 수 있고, 업무에 더 빨리 적응하는데에도 도움이 됩니다.

![BlogCodeReview]

<figcaption>어떤 블로그 글에 대해 리뷰를 하면서 코멘트로 의견을 교환하고 있습니다.<br>
코드 리뷰 또한 비슷한 방법을 통해 이루어지고 있습니다.</figcaption>

업무상 코드 리뷰 뿐만 아니라 **새로운 블로그 글을 리뷰하기 위해 Pull request를 활용**하고 있습니다.
어떤 개발자가 글을 작성하기 위해서 가장 먼저 하는 것은 블로그를 관리하는 Git 리포지터리에서 새로운 브랜치를 따는 것입니다.
해당 브랜치에서 글을 작성하고 작성한 후에는 새로운 글 내용을 push한 후 master 브랜치로 Pull request를 날립니다.
이때 리뷰어로 등록된 사람과 그 외 개발자들은 내용에 대한 의견이나 첨삭을 댓글로 달 수 있습니다.
충분한 리뷰를 통해 발행이 확정된 글은 블로그 관리자에 의해 master 브랜치에 머지 되고 비로소 발행 준비가 끝납니다.

### 스크립트를 통한 블로그 글 발행 자동화와 보안

준비가 끝난 새로운 블로그 글을 발행하기 위해서는 일련의 작업이 필요합니다.
Jekyll을 이용해 정적 파일들을 만든 후, [htmlcompressor] 통해 정적 파일들을 압축해야 합니다.
이렇게 압축된 정적 파일들을 S3에 업로드 하고, CloudFront에 Invalidation 요청을 날리고, 구글 웹 마스터 도구에 핑을 날립니다.
이런 과정들을 s3cmd와 Rakefile을 이용하여 스크립트를 실행하는 것만으로 자동으로 이루어지도록 하였습니다.
**VCNC 개발팀은 여러 가지 업무 들을 자동화시키기 위해 노력**하고 있습니다.

또한, s3에 사용하는 AWS Credential은 IAM을 이용하여 블로그를 호스팅하는 s3 버킷과 CloudFront에 대한 접근 권한만 있는 키를 발급하여 사용하고 있습니다.
비트윈은 특히 커플들이 사용하는 서비스라 보안에 민감합니다. 실제 비트윈을 개발하는데에도 **보안에 많은 신경을 쓰고 있으며, 이런 점은 엔지니어링 블로그 운영하는데에도 묻어나오고** 있습니다.

## 맺음말

VCNC 개발팀은 엔지니어링 블로그를 관리하고 운영하기 위해 다소 독특한 방법을 사용합니다. 이 방법은 개발팀이 일하는 방법과 문화에서 큰 영향을 받았습니다.
JIRA를 통한 이슈 관리 및 스프린트, Pull request를 이용한 상호간 코드 리뷰 등은 이제 VCNC 개발팀의 문화에 녹아들어 가장 효율적으로 일할 수 있는 방법이 되었습니다.
개발팀을 꾸려나가면서 여러가지 시행 착오를 겪어 왔지만, 시행 착오에 대한 반성과 여러가지 개선 시도를 통해 계속해서 더 좋은 방법을 찾아나가며 지금과 같은 개발 문화가 만들어졌습니다.
그동안 그래 왔듯이 앞으로 더 많은 개선을 통해 꾸준히 좋은 방법을 찾아 나갈 것입니다.

네 그렇습니다. 결론은 저희와 함께 고민하면서 더 좋은 개발문화를 만들어나갈 개발자를 구하고 있다는 것입니다.

[helloworldengineeringblog]: /2013-04-15-hello-world
[wordpress]: http://wordpress.org/
[github]: https://github.com
[tumblr]: https://www.tumblr.com/
[jekyll]: https://github.com/mojombo/jekyll
[tom preston-werner]: https://www.linkedin.com/pub/tom-preston-werner/4/122/382
[bootstrap]: http://getbootstrap.com/
[s3]: http://aws.amazon.com/s3/
[hostingons3]: http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html
[allthingsdistributed]: http://www.allthingsdistributed.com/
[cloudfront]: http://aws.amazon.com/cloudfront/
[s3cmd]: http://s3tools.org/s3cmd
[htmlcompressor]: https://code.google.com/p/htmlcompressor/
[liquid]: https://github.com/Shopify/liquid
[markdown]: http://daringfireball.net/projects/markdown/
[jira]: https://www.atlassian.com/software/jira
[stash]: https://www.atlassian.com/software/stash/overview
[github enterprise]: https://enterprise.github.com/
[responsive web design]: http://en.wikipedia.org/wiki/Responsive_web_design
[closure compiler]: https://developers.google.com/closure/compiler/
[atlassian]: https://www.atlassian.com/
[git]: http://www.git-scm.com/
[jiraresolvechart]: ./blog-jira-graph.jpg 'JIRA에서 이슈에 대한 해결 차트'
[blogpostissues]: ./blog-post-issues.png 'JIRA에 등록된 블로그 포스트 이슈들'
[blogcodereview]: ./blog-code-review.png '블로그 글에 대한 리뷰를 위한 코멘트'
