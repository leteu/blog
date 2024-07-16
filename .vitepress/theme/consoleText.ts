const css = `
    @font-face {
      font-family: 'MesloLGS NF';
      font-weight: normal;
      font-style: normal;
      font-display: swap;
      src: url('/fonts/MesloLGSNF/MesloLGS-NF-Regular.woff2') format('woff2');
    }

    font-family: 'MesloLGS NF', 'Courier New', monospace;
    background: linear-gradient(90deg,#00ffb3 0%, #00a372 60%, #0080a3 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  `

const message =
  '                                                                            \
\n  ██╗     ███████╗████████╗███████╗██╗   ██╗       ██████╗ ███████╗██╗   ██╗ \
\n  ██║     ██╔════╝╚══██╔══╝██╔════╝██║   ██║       ██╔══██╗██╔════╝██║   ██║ \
\n  ██║     █████╗     ██║   █████╗  ██║   ██║       ██║  ██║█████╗  ██║   ██║ \
\n  ██║     ██╔══╝     ██║   ██╔══╝  ██║   ██║       ██║  ██║██╔══╝  ╚██╗ ██╔╝ \
\n  ███████╗███████╗   ██║   ███████╗╚██████╔╝  ██╗  ██████╔╝███████╗ ╚████╔╝  \
\n  ╚══════╝╚══════╝   ╚═╝   ╚══════╝ ╚═════╝   ╚═╝  ╚═════╝ ╚══════╝  ╚═══╝   \
\n                                                                             '

console.log('%c %s', css, message)
