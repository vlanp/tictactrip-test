<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Website][website-shield]][website-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Test Tictactrip</h3>

  <p align="center">
    Back-end project developed as part of the Tictactrip application process
    <br/>
    <br/>
    <a href="https://tictactrip-test.vlanp.com/">Access Deployed API</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

As part of the Tictactrip application process, candidates are required to implement and deploy a REST API that justifies text passed as a parameter according to the following instructions:

- The line length of the justified text must be 80 characters.
- The endpoint must be in the form /api/justify and must return justified text following a POST request with a body of ContentType text/plain
- The API must use an authentication mechanism via unique token. For example, using an endpoint api/token that returns a token from a POST request with a json body {"email": "foo@bar.com"}.
- There must be a rate limit per token for the /api/justify endpoint, set at 80,000 words per day. If there are more within the day, a 402 Payment Required error must be returned.

### Built With

- [![Express][Express]][Express-url]
- [![Mongoose][Mongoose]][Mongoose-url]
- [![Node.js][Node.js]][Node.js-url]
- [![Zod][Zod]][Zod-url]

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

[MongoDB community server](https://www.mongodb.com/try/download/community)  
[Node.js](https://nodejs.org/fr/download)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/vlanp/tictactrip-test.git
   ```
2. Install NPM packages with PNPM
   ```sh
   pnpm install
   ```
3. Run the TypeScript compiler
   ```sh
   pnpm tsc
   ```
4. Create a `.env` file at the project root

```env
  # Example configuration - adjust values as needed
  PORT=3000
  MONGODB_URI=mongodb://127.0.0.1:27017/
  DB_NAME=tictactrip-test
  TEST_DB_NAME=tictactrip-test-jest
```

5. Launch the server
   ```sh
   node dist/src/app.js
   ```

<!-- LICENSE -->

## License

Distributed under the Unlicense License. See `LICENSE.txt` for more information.

<!-- CONTACT -->

## Contact

Valentin GUILLAUME - vguillaumedev@gmail.com

Project Link: [https://github.com/vlanp/tictactrip-test](https://github.com/vlanp/tictactrip-test)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/vlanp/tictactrip-test.svg?style=for-the-badge
[contributors-url]: https://github.com/vlanp/tictactrip-test/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/vlanp/tictactrip-test.svg?style=for-the-badge
[forks-url]: https://github.com/vlanp/tictactrip-test/network/members
[stars-shield]: https://img.shields.io/github/stars/vlanp/tictactrip-test.svg?style=for-the-badge
[stars-url]: https://github.com/vlanp/tictactrip-test/stargazers
[issues-shield]: https://img.shields.io/github/issues/vlanp/tictactrip-test.svg?style=for-the-badge
[issues-url]: https://github.com/vlanp/tictactrip-test/issues
[license-shield]: https://img.shields.io/github/license/vlanp/tictactrip-test.svg?style=for-the-badge
[license-url]: https://github.com/vlanp/tictactrip-test/blob/master/license.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/valentin-guillaume-b3b9742ab
[website-shield]: https://img.shields.io/badge/-Website-black.svg?style=for-the-badge&colorB=555
[website-url]: https://portfolio-v2-puce-ten.vercel.app/
[Mongoose]: https://img.shields.io/badge/Mongoose-800?logo=mongoose&logoColor=fff&style=for-the-badge
[Mongoose-url]: https://mongoosejs.com/
[Express]: https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=for-the-badge
[Express-url]: https://expressjs.com/
[Node.js]: https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=fff&style=for-the-badge
[Node.js-url]: https://nodejs.org/fr
[Zod]: https://img.shields.io/badge/Zod-408AFF?logo=zod&logoColor=fff&style=for-the-badge
[Zod-url]: https://zod.dev/
