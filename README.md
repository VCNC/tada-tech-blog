# TADA Tech Blog

`TADA 기술 블로그 Repository` 입니다.  
다양한 경험을 공유하여 다른 개발자들의 의사 결정에 도움이 되고, 상호 피드백을 통해 보다 더 성장하기 위한 글을 작성하는 공간입니다.

## 개발 환경

- [Gatsby]로 작성되어 있습니다.
  - 게시물 작성은 [Markdown]으로 작성하고, 경우에 따라 inline html을 사용합니다.
  - 마크다운 문법이 화면에 이상하게 적용되면 알려주시기 바랍니다.
- 게시물 댓글은 [Utterances]를 통해 [여기에](https://github.com/VCNC/blog-comment) 수집합니다.

## 로컬에서 실행하기

Gatsby는 React 기반의 프레임워크로 로컬에서 실행하기 위해, Nodejs 설치가 필요합니다.

### Node 설치하기

1. **Homebrew 설치**

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew update
```

2. **node 설치 및 확인 (nvm 통해서 설치하셔도 됩니다.)**

```bash
brew install node
node -v
npm -v
```

### 실행하기

1. `yarn` / `yarn install`: 필요한 패키지 내용을 설치합니다.
2. `yarn dev`: 로컬에서 Gatsby를 실행합니다.
   - `http://localhost:8000` 을 기본으로 합니다.

## 게시물 작성

### 글 작성 양식

게시물은 마크다운을 기준으로 작성하며 자세한 내용은 다음에서 설명합니다.

👉 [글 작성 양식 보러가기]

### 게시물 업로드 방법

기술 블로그의 업로드 방식은 다음과 같은 프로세스를 따릅니다.

1. **글의 제목과 주제를 선정하고, 브랜드 디자인팀에 대표 이미지를 요청**

   - [대표 이미지 구글 드라이브]에 폴더를 생성합니다.
   - 이미지 요청시에 담고 싶은 메타포를 전달하면 좋습니다.

2. **`main` 브랜치로부터 개인 브랜치를 생성**

   - 가능하면 글 제목 또는 주제로 브랜치명을 만들어주세요.

3. **`_posts` 폴더 내부에 게시글용 폴더를 생성**

   - `index.md` 에 [글 작성 양식]을 맞춰 글을 작성해주세요.
   - [Typora]와 같은 마크다운 툴을 통해 글을 미리 확인하는 것도 좋습니다.
   - 게시물 업로드 날짜가 정확하지 않다면, 일단 예상되는 날짜로 입력한 후 게시 전에 수정해주세요.

4. **Pull Request**

   - 글을 작성한 후에는 Push & Pull Request 를 진행해주세요.
   - `Label`에 `New Post`를 선택해주세요.
   - `Assignee`는 본인으로 입력 부탁드립니다.
   - PR 이 등록되면, Preview 배포가 진행됩니다.

5. **리뷰 진행**

   - 팀원 또는 다른 개발자에게 리뷰를 요청하세요.
   - 가능하면 모든 Comment를 Resolve 해주세요.

6. **실서버 배포**
   - PR이 `main` 브랜치로 Merge 되면 자동으로 실서버 배포가 진행됩니다.

[gatsby]: https://www.gatsbyjs.com/
[markdown]: http://daringfireball.net/projects/markdown/
[disqus]: https://disqus.com/
[utterances]: https://utteranc.es/
[글 작성 양식 보러가기]: https://github.com/VCNC/tada-tech-blog/tree/main/_posts#readme
[글 작성 양식]: #글-작성-양식
[대표 이미지 구글 드라이브]: https://drive.google.com/drive/u/1/folders/12bWBSvZ39IgqGOo4SgOqYE4Mi616GxoK
[typora]: https://typora.io/
