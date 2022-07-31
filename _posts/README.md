# 게시물 작성 방법

기술 블로그 게시물 작성은 마크다운을 기본으로 합니다.
[Typora](https://typora.io/)와 같은 툴을 통해 마크다운을 미리 확인하셔도 됩니다.

## 게시물 메타 데이터

: 마크다운 파일 최상단에 메타데이터를 테이블 형섹으로 입력합니다.

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

### 세부사항에 대한 설명

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
  - **profileimage**: 작성자의 프로필 이미지입니다. 게시물 폴더에 저장하고, 상대경로를 입력합니다. 없는 경우, 기본 타다 프로필 이미지가 노출됩니다. (선택)
  - **comment**: 소개 또는 하고싶은 말을 적습니다. (선택)
  - **link**: 작성자의 정보가 연결된 주소를 입력합니다. (선택)

👉 [참고 예시](https://github.com/VCNC/tada-tech-blog/edit/main/_posts/2022-07-25-tech-blog-renewal/index.md)

👇🏻 **아래부터 마크다운 문법을 바탕으로 게시물을 작성하시면 됩니다.**
