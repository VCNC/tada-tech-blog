# 게시물 작성 방법

기술 블로그 게시물 작성은 마크다운을 기본으로 합니다.

## 게시물 메타 데이터에 대한 설명

**게시물 메타 데이터는 다음과 같은 형태를 가집니다.**

```
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
```
