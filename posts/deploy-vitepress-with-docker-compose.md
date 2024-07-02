---
{
  title: '[ci cd] Docker compose로 Vitepress 배포하기',
  subtitle: 'Docker와 Docker Compose로 Vitepress 등 정적 사이트 간단하게 배포하기',
  timestamp: 1718951846,
  outline: 'deep',
  tags: ['docker', 'vitepress', 'docker compose'],
  layout: 'doc',
  mainImg: '/images/deploy-vitepress-with-docker-compose.webp',
}
---

::: info

이 포스트는 아래 링크의 포스트에 연결되는 내용이니 혹시나 안 보고 왔으면 보고 오도록  
[[ci cd] Docker로 Vitepress 배포하기](/posts/deploy-vitepress-with-docker.md)

:::

이번 포스트는 이전에 너무 길게 적어서 짧게 쓰고 넘어가려고 한다.

## 1. 도커 컴포즈 작성

::: code-group

```yml [docker-compose.yml]
version: 3 # docker compose가 구버전인 사람만 붙여주면 된다. 난 최신 버전써서 안붙여도 된다.

name: blog
services:
  docs:
    build: .
    container_name: blog
    ports:
      - '8080:80'
    stdin_open: true
    tty: true
```

:::

### 1-1. version

이전에 `docker-compose.yml` 작성해 봤다고 하는 사람들은 `version` 왜 안 적어도 되냐고 할 수도 있다.  
최신 버전의 `docker compose`에서는 없어졌다. 이제 안 적어도 된다.

### 1-2. name

```bash
docker compose ps
```

했을 때 나오는 `docker compose`의 이름이다.

### 1-3. services

원래 같았으면 services에 다른 docker파일에 있는 이것저것 다 한 번에 띄우고 한 네트워크로 묶겠지만 우리는 정적파일 배포하는 nginx 컨테이너 하나밖에 없기 때문에 이 밑에 하나만 할 거다.

서비스 이름은 마음대로 지어도 되는데 나는 그래도 문서니까 `docs`라고 이름 붙여뒀다.

#### 1-3-1. build

빌드는 Dockerfile의 위치를 나타내게 된다.  
다른 곳에 올려뒀으면 `image`라고 적어서 외부 저장소의 이미지를 바로 작성해 두거나 로컬에서 빌드한 이미지를 사용하겠지만  
나는 이미 빌드하는 것조차 귀찮기 때문에 그냥 `docker compose`가 알아서 내 dockerfile 가지고 혼자 이미지 만들어서 띄웠으면 좋겠기에 현재 경로인 `. (점)`으로 적어뒀다.

#### 1-3-2. container_name

안 적어줘도 알아서 아무 이름 붙여다 두는데, 나중에 exec 하거나 할 때 그거 검색해서 찾고 그러는 거 귀찮아서 미리 `blog`라고 고정해 뒀다.  
맘에 드는 거로 바꿔서 작성해 둬도 된다. 오늘은 안 쓸 거니까

#### 1-3-3. ports

`docker run` 할 때 `-p` 옵션 줘서 하던 그거다.  
모르겠으면 이전글 다시 보고 오는 게 좋을 거 같다.

#### 1-3-4. stdin_open & tty

가끔 컨테이너 내부에 들어가서 확인하거나 할 때가 있을 수도 있는데 그렇게 하려면 이거 적어둬야 한다.

## 2. 실행

```bash
docker compose up -d

# 구버전일 경우
docker-compose up -d
```

뒤에 붙여주는 `-d` 옵션은 뒤에서 알아서 혼자 돌고 있으라는 소리다.  
더 정확하고 자세히 알고 싶다면 `docker compose` 공식 문서를 보자

## 3. 업데이트

```bash
docker compose up -d --build

# 구버전일 경우
docker-compose up -d --build
```

`--build` 옵션은 위에서 말한 공식 문서 한 번이라도 보고 왔으면 알 텐데 모르겠으면 진짜 한 번만 보러 가라.  
해당 명령어가 실패하면 기존에 돌고 있던 컨테이너가 그대로 돌고 있을 것이고 성공하면 업데이트가 바로 된다.  
일단 내가 작성한 dockerfile 기준으론 이렇게만 적어도 업데이트가 될 텐데 다른 상황인 사람들은 [down](#_4-중단)한번 해주고 다시 [up](#_2-실행) 해주면 될 거다.

## 4. 중단

```bash
docker compose down

# 구버전일 경우
docker-compose down
```

## 마치며

`docker run` 해가 지고 이것저것 옵션 붙여가면서 꾸역꾸역 실행하는 거보다는 `docker compose` 파일 하나 작성해 두고 실행하면 편하고 좋은 거 같다.  
~~팀원들 알려줄 때도 명령어 한 줄만 알려줘도 돼서 편하고~~
