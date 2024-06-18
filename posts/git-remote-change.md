---
{
  title: '[Git] Git Remote repository 변경',
  subtitle: '',
  timestamp: 1677932160,
  outline: 'deep',
  tags: ['git', 'remote'],
  layout: 'doc',
  mainImg: '/images/Git.jpg',
}
---

<PostDetailHeader />

사내에서 깃랩 주소가 바뀌거나 프로젝트 이름이나 주소를 바꾸는 경우가 종종 있었다.  
검색해서 보면 되기에 굳이 외워두지는 않았는데 계속 검색하기도 귀찮아서 외워둘겸 메모해두려고 한다.

## 1. 자주 발생하는 오류

```log
fatal: 'origin' does not appear to be a git repository
fatal: Could not read from remote repository.

Please make sure you have the correct access rights and the repository exists.
```

이거 때문에 고생해서 오는 사람 많을 거 같다.  
얘도 똑같이 따라 해 주면 고쳐질 수도 있다. ( 아닐 수도 있다 )

## 2. Remote 확인

일단 확인부터 하자

```bash
git remote -v
```

실행하고 나면 보통 아래처럼 2줄 정도 뜬다.

```log
origin	https://github.com/leteu/leteu.git (fetch)
origin	https://github.com/leteu/leteu.git (push)
```

여기서  [1번](#1-자주-발생하는-오류)처럼 오류가 난다면 https 가 아니라 http 라고 적혀 있어서 그런 게 대부분일 거라 생각한다.  
아니라면 url이 변경되었거나 뭐 그런 거다

## 2. Remote URL 변경

```bash
git remote ser-url <remote 이름 (ex. origin)> <git 주소>
```

이거면 웬만해선 다 될 거다.  
`<remote 이름>`에 url을 명령어 마지막에 작성하는 `<git 주소>`로 바꿔준다.

## 3. Remote name 변경

```bash
git remote rename <원래 이름> <바꿀 이름>
```

`<원래 이름>`을 `<바꿀 이름>`으로 바꿔준다.
기존 저장소 이름 바꾸고 새 저장소를 origin으로 바꾸고 싶을 때 쓸 수 있다.

## 4. Remote 추가

```bash
git remote add <remote 이름> <git 주소>
```

`<remote 이름>`으로 remote를 하나 더 만들어 준다.

## 5. Remote 삭제

```bash
git remote remove <remote 이름>
```

위 명령어를 실행하면 로컬에서 `<remote 이름>` 리모트를 삭제한다.  
원격 저장소 지워지는 거 아니니까 걱정 말자.
