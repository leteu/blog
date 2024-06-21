---
{
  title: '[ci cd] Docker로 Vitepress 배포하기',
  subtitle: 'Docker로 Vitepress 등 정적 사이트 간단하게 배포하기',
  timestamp: 1718950234,
  outline: 'deep',
  tags: ['docker', 'vitepress', '배포', '정적 사이트 배포', 'nginx'],
  layout: 'doc',
  mainImg: '/images/deploy-vitepress-with-docker.png',
}
---

블로그를 Tistory에서 직접 사이트 만들어서 하고 싶은 마음이 들었다.  
하지만 역시 처음부터 다 하는 건 귀찮을 거 같아서 vitepress라는 vue 개발팀에서 만든 ssg<FootnoteTooltip footnote="1">[^1]</FootnoteTooltip>툴에 테마만 좀 변경하고 추가해서 쓰면 쉽겠다 싶어서 뚝딱뚝딱 만들었다.  
만들고 나니 배포해야 하는데 Ubuntu 서버에 nginx니 node니, 설치해서 쓰고 싶진 않아서<FootnoteTooltip footnote="2">[^2]</FootnoteTooltip> 포스트도 쓸 겸 해서 이번에도 docker로 배포하고 작성해 본다.

## 1. vitepress build

이 부분 넘겨도 되는데 안 넘겼으면 좋겠다.  
아래 명령어를 통해 markdown 파일들을 정적 파일로 빌드 해줄 수 있다.

```bash
vitepress build

```

혹은 처음 세팅할 때 package.json에 script 추가하기를 선택하여 빌드 명령어 등을 추가했다면 아래 명령어로도 사용 가능하다.

```bash
<사용한 패키지 매니저> run docs:build

## ex)
pnpm run docs:build
```

이렇게 빌드하고 나면 `.vitepress/dist` 폴더에 정적 파일들이 담겨서 나오게 된다.

## 2. Dockerfile - build stage 작성

::: info
dockerfile 작성 설명 별로 안 궁금하고 바로 완성된 코드만 보고 싶다면?

> [여기 클릭](#_4-완성된-dockerfile)

:::

위에서 해줬던 빌드는 사실 Docker 컨테이너 내부에서 실행되어도 상관이 없기 때문에 Dockerfile에서 빌드하는 부분을 작성해 준다.

```dockerfile
# Build
FROM node:20-alpine as build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN apk --no-cache add git
RUN pnpm run docs:build
```

`build stage`로 하는 이유는 냅다 모든 과정을 다 이미지로 구워 버리면 이미지의 용량이 쓸데없이 커지게 된다.  
build 후 dist 폴더만 `deploy stage`로 옮긴 후 `deploy stage`만 이미지로 구워서 쓸 예정이다.

### 2-1. FROM

docs:build를 실행시켜야하기 때문에 node가 있는 컨테이너에서 작업을 해야 한다.  
그래서 `node:20-apline`<FootnoteTooltip footnote="3">[^3]</FootnoteTooltip>을 base image로 사용하여 `build stage`를 만들어준다.

### 2-2. ENV

```dockerfile
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
```

이 3줄짜리 코드는 `node:20-alpine`에서 pnpm을 사용하기 위해 작성했다.  
관련 내용은 [여기](https://pnpm.io/docker)서 확인이 가능하다.

### 2-3. WORKDIR

컨테이너 내부의 어느 경로에서 작업을 할지 정하는 부분이다.  
보통 `/app`에서 한다.

### 2-4. COPY

컨테이너에 Dockerfile이 위치한 곳의 파일을 복사해 갈 때 사용한다.

```dockerfile
COPY <외부 경로> <컨테이너 내부 경로>

# vitepress 위치가 루트에 있다면
COPY . .

# vitepress 위치가 `docs` 폴더에 있다면
COPY ./docs .
```

나는 `COPY . .` 이라고 작성했으니 있는 파일 다 들고 가라고 한 것이다.  
여기서 불필요한 파일(ex. node_module, dist, README.md, ... )은 굳이 들고 갈 필요가 없으니 `.gitignore` 파일을 만들어 주듯이 `.dockerignore`을 통해 제외해 준다.

::: code-group

```txt [.dockerignore]
node_modules
*.log
.DS_Store
.idea
.temp
.vite_opt_cache
.vscode
pnpm-global
build
cache
dist
temp
examples-temp
license
README.md
```

:::

### 2-5. RUN

```dockerfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
```

dependencies 들을 설치해 주는 부분이다.

```dockerfile
RUN pnpm install
```

이렇게만 작성해도 될 텐데 뭐 이렇게 어렵게 작성해 뒀냐고 한다면  
docker image를 만들 때마다 처음부터 패키지를 install 할거였으면 pnpm이니 yarn 을 쓸 이유가 없다.  
그래서 캐시된 패키지도 사용해서 쓰기 위해 이렇게 작성했다.  
[여기](https://pnpm.io/docker)보고 따라 한 게 맞다.

```dockerfile
RUN apk --no-cache add git
```

vitepress의 lastUpdate 옵션을 사용하기 위해 git을 설치하는 곳이다.  
lastUpdate 안 쓸 거면 안 적어도 되고 [2-1. FROM](#_2-1-from)에서도 `node:20-slim` 사용해도 된다.

```dockerfile
RUN pnpm run docs:build
```

드디어 빌드하는 부분이다.  
빌드를 하게 되면 컨테이너 내부에 `/app/.vitepress/dist` 경로에 빌드가 되어있을 것이다.
이제 배포하기 위한 정적 파일이 준비되었다.

## 3. Dockerfile - deploy 작성

이제 빌드된 파일을 배포하기 위한 배포용 stage를 만들어 볼 것이다.

```dockerfile
# Deploy
FROM nginx:alpine as deploy

COPY --from=build /app/.vitepress/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3-1. FROM

정적 html, css, js 및 asset들을 전달하기 위한 웹서버가 필요하다.  
nginx로 할 거다.

`nginx:alpine` 이미지를 베이스 이미지로 사용한다고 작성하고 시작해 보겠다.

### 3-2. COPY

아까 빌드했던 dist 파일을 `deploy stage`로 들고 오는 부분이다.

```dockerfile
COPY --from=build /app/.vitepress/dist /usr/share/nginx/html
```

아까는 dockerfile이 존재하는 root에서 파일을 들고 왔지만 `--from=build` 옵션을 통해 `build stage`에서 파일을 들고 오게 된다.  
nginx의 root 경로인 `/usr/share/nginx/html`에 `dist`폴더의 내용을 다 옮겨주도록 하자.

nginx 설정 또한 컨테이너 빌드 할때마다 바뀔 테니 프로젝트 root든 어디에 `default.conf`라고 nginx 설정 파일을 만들어서 `deploy stage`로 들고 오도록 하자.

```dockerfile
COPY default.conf /etc/nginx/conf.d/default.conf
```

아래 코드는 내가 사용한 nginx 설정 파일이다.  
vitepress 공식 문서의 [여기](https://vitepress.vuejs.kr/guide/deploy#nginx)서 들고 왔다.  
rss 파일은 .xml 안 보이게 하고 싶어서 따로 `/rss`로 들어오면 `/rss.xml`을 전달해 주도록 살짝 수정해 줬다.

::: code-group

```nginx [default.conf]
server {
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    listen 80;
    server_name _;
    index index.html;

    location / {
        # content location
        root /usr/share/nginx/html;

        # exact matches -> reverse clean urls -> folders -> not found
        try_files $uri $uri.html $uri/ =404;

        # non existent pages
        error_page 404 /404.html;

        # a folder without index.html raises 403 in this setup
        error_page 403 /404.html;

        # adjust caching headers
        # files in the assets folder have hashes filenames
        location ~* ^/assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    location = /rss {
        root /usr/share/nginx/html;
        try_files /rss.xml =404;
        default_type application/rss+xml;
        add_header Content-Type application/rss+xml;
        add_header X-Content-Type-Options nosniff;
    }
}
```

:::

### 3-3. EXPOSE

```dockerfile
EXPOSE 80
```

도커 컨테이너 내부에서 열린 포트를 host에서도 쓸 수 있게 해주는 부분이다.  
이거 안 넣어두면 말짱 도루묵이니 작성해서 80 포트 오픈해 주도록 하자.

::: danger
다른 포트로 열고 싶은 건 알겠으니 일단 이렇게 작성하도록 하자.  
나중에 컨테이너의 80 포트랑 host의 다른 포트랑 연결하는 거 알려줄 테니 조금만 참자.

> [바로가기](#_5-2-실행)

:::

### 3-4. CMD

```dockerfile
CMD ["nginx", "-g", "daemon off;"]
```

CMD는 해당 컨테이너가 수행하게 될 실행 명령어를 작성하는 부분이다.  
컨테이너가 최종적으로 수행할 부분이니 RUN이랑 혼동하지 말자.  
우리는 nginx 띄울 거니까 nginx 시작 명령어 작성해 주면 될 거 같다.

## 4. 완성된 Dockerfile

```dockerfile
# Build
FROM node:20-alpine as build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN apk --no-cache add git
RUN pnpm run docs:build

# Deploy
FROM nginx:alpine as deploy

COPY --from=build /app/.vitepress/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## 5. 이미지 굽기 & 실행

### 5-1. 이미지 생성

```bash
docker build -t <이미지 이름> .

# ex)
docker build -t blog .
```

맨 마지막 `. (점)` 빼먹지 말도록 하자.  
build 관련 추가 옵션 및 명령어는 공식 문서 확인하는 거로~

### 5-2. 실행

```bash
docker run -it -p <원하는 포트>:80 <이미지 이름>

# ex)
docker run -it -p 80:80 blog
```

run 관련 추가 옵션 및 명령어는 공식 문서 확인하는거로~

## 6. 마치는 글

Docker compose를 통해서 실행하고 싶다면 [다음 포스트](./deploy-vitepress-with-docker-compose.md)를 확인하거나 내 블로그 github 가서 긁어가면 된다.  
서버 없는 사람들을 위해서 어차피 정적 파일밖에 없는 vitepress 파일들을 굳이 서버에 안 올리고 github page에 action을 통해서 main 브랜치에 push 될 때 배포되도록 하는 방법 역시 작성을 해둘 생각이다.

[^1]: Static Site Generator
[^2]: 기존에도 docker만 가지고 해서 서버에 잡다하게 설치하지 않고 사용하고 있었다.
[^3]: `node:20-slim`을 사용하려고 했는데 vitepress에서 lastUpdate 옵션을 사용하려면 git이 필요한 이슈가 있어서 변경했다.
