# TADA Tech Blog

`TADA 기술 블로그 Repository` 입니다.  
다양한 경험을 공유하여 다른 개발자들의 의사 결정에 도움이 되고, 상호 피드백을 통해 보다 더 성장하기 위한 글을 작성하는 공간입니다.

<br/>

## 개발 환경

- [Gatsby]로 작성되어 있습니다.
  - 게시물 작성은 [Markdown]으로 작성하고, 경우에 따라 inline html을 사용합니다.
  - 마크다운 문법이 화면에 이상하게 적용되면 알려주시기 바랍니다.
- 게시물 댓글은 [Utterances]를 통해 [여기에](https://github.com/VCNC/blog-comment) 수집합니다.

<br/>

## 로컬에서 실행하기

Gatsby는 React 기반의 프레임워크로 로컬에서 실행하기 위해, Nodejs 설치가 필요합니다.

### Node 설치하기

1. **Homebrew 설치**

```bash
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
$ brew update
```

2. **node 설치 및 확인 (nvm 통해서 설치하셔도 됩니다.)**

```bash
$ brew install node
$ node -v
$ npm -v
```

### 실행하기

```bash
$ yarn # 필요한 디펜던시를 설치합니다.
$ yarn dev # http://localhost:8000 에 개발 블로그 서버를 띄웁니다
```

<br/>

## 게시물 작성

기술 블로그 게시물 작성은 마크다운을 기본으로 합니다.
[Typora]와 같은 툴을 통해 마크다운을 미리 확인하셔도 됩니다.

### 게시물 메타 데이터

: 마크다운 파일 최상단에 메타데이터를 테이블 형식으로 입력합니다.

**게시물 메타 데이터는 다음과 같은 형태를 가집니다.**

```
---
layout: post
date: yyyy-mm-dd 10:00:00 +09:00
permalink: /yyyy-mm-dd-post-title

title: "게시물 타이틀 입니다."
description: 게시물에 대한 간단한 설명 입니다.
thumbnail:
  - color: ./thumbnail-color.png
    gray: ./thumbnail-gray.png
tags: ["태그1", "태그2", "태그3", "태그4", "태그5"]

authors:
  - name: 작성자1 이름
    profileImage: 작성자1 프로필 이미지
    comment: 작성자1의 소개 또는 한 마디
    link: 작성자1 관련 링크
  - name: 작성자2 이름
    link: 작성자2 관련 링크
---
```

🎤 **세부사항에 대한 설명**

- **layout**: `post` 로 둡니다.
- **date**: 게시 예정일로 오전 10시에 맞춰 입력합니다.
- **permalink**: 게시물의 url 에 해당하는 부분으로, 폴더명과 일치시킵니다. (date 값과 일치)
- **title**: 작성한 게시물의 제목을 입력합니다.
- **description**: 게시물에 대한 간단한 설명을 입력합니다.
- **thumbnail**: 목록에 나타나는 게시물의 대표이미지로 브랜드디자인 팀에 color, gray 두 종류를 요청합니다.
  - 각 이미지는 게시물 폴더 내부에 `thumbnail-color.png` / `thumbnail-gray.png` 형태로 저장합니다.
  - 메타데이터 부분은 상단의 예시와 동일하게 상대경로로 입력합니다.
- **tags**: 게시물 검색이나 필터 기능을 사용하기 위한 정보로 `String[]` 형태로 입력합니다.
- **authors**: 게시물 작성자에 대한 정보입니다. 여러명을 입력할 수 있으나, 게시물 상단에는 모두의 이름이 노출되고, 하단에는 첫사람의 정보만 노출됩니다.
  - **name**: 작성자의 이름입니다. `영어이름 성`의 형태로 입력합니다. (필수)
  - **profileImage**: 작성자의 프로필 이미지입니다. 게시물 폴더에 저장하고, 상대경로를 입력합니다. 없는 경우, 기본 타다 프로필 이미지가 노출됩니다. (선택)
  - **comment**: 소개 또는 하고싶은 말을 적습니다. (선택)
  - **link**: 작성자의 정보가 연결된 주소를 입력합니다. (선택)

👉 [참고 예시]

👇🏻 **아래부터 마크다운 문법을 바탕으로 게시물을 작성하시면 됩니다.**

<br/>

## 게시물 업로드

기술 블로그의 업로드 방식은 다음과 같은 프로세스를 따릅니다.

1. **글의 제목과 주제를 선정하고, 브랜드 디자인팀에 대표 이미지를 요청**

   - [#req_mkt_bx] 채널에 `기술블로그 게시글 대표이미지 요청` 워크플로우를 통해 요청합니다.

2. **`main` 브랜치로부터 개인 브랜치를 생성**

   - 가능하면 글 제목 또는 주제로 브랜치명을 만들어주세요.

3. **`_posts` 폴더 내부에 게시글용 폴더를 생성 및 글 작성**

   - `index.md` 에 [글 작성 양식]을 맞춰 글을 작성해주세요.

4. **Pull Request**

   - 글을 작성한 후에는 Push & Pull Request 를 진행해주세요.
   - `Label`에 `New Post`를 선택해주세요.
   - `Assignee`는 본인으로 입력 부탁드립니다.
   - PR 이 등록되면, [Gatsby Cloud]에서 Preview 배포가 진행됩니다.

5. **리뷰 진행**

   - 팀원 또는 다른 개발자에게 리뷰를 요청하세요.
   - 가능하면 모든 Comment를 Resolve 해주세요.

6. **og image 업로드**

   - 게시물 업로드 날짜가 확정되면, [Static Server]에 permalink 와 같은 이름의 폴더를 생성하고, `thumbnail_og.png` 이미지를 업로드합니다.

7. **실서버 배포**
   - PR이 `main` 브랜치로 Merge 되면 자동으로 실서버 배포가 진행됩니다.

<br/>

## 배포

- [Gatsby Cloud]에서 VCNC-Bot 계정으로 로그인하여 확인할 수 있습니다.
- 계정 정보는 1Password 에서 확인 가능합니다.

[gatsby]: https://www.gatsbyjs.com/
[markdown]: http://daringfireball.net/projects/markdown/
[disqus]: https://disqus.com/
[utterances]: https://utteranc.es/
[typora]: https://typora.io/
[참고 예시]: https://github.com/VCNC/tada-tech-blog/edit/main/_posts/2022-07-25-tech-blog-renewal/index.md
[#req_mkt_bx]: https://vcnc.slack.com/archives/CBBKZSXF1
[글 작성 양식]: #게시물-작성
[gatsby cloud]: https://www.gatsbyjs.com/products/cloud/
[static server]: https://github.com/VCNC/static.tadatada.com/tree/master/public/resources/blog
