import React from 'react'; // Adicione esta linha
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${propriedades.githubUser}.png`}
        style={{ borderRadius: '8px' }}
      />
      <hr />

      <p>
        <a
          className="boxlink"
          href={`https://github.com/${propriedades.githubUser}`}
        >
          @{propriedades.githubUser}
        </a>
      </p>

      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smalltitle">
        {propriedades.title}({propriedades.itens.length})
      </h2>
      <ul>
        {propriedades.itens.slice(0, 6).map((itemAtual) => (
          <li key={itemAtual.id}>
            <a href={`https://github.com/${itemAtual.login}`}>
              <img src={itemAtual.avatar_url} style={{ borderRadius: '8px' }} />
            </a>
          </li>
        ))}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const githubUser = 'gabrielly77';
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
  ];
  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function () {
    fetch('https://api.github.com/users/peas/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      });

    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        Authorization: '7381bceb72cc1dbbee071772c9db48',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `query {
          allCommunities(first: 6, orderBy: createdAt_DESC) {
            title
            id
            imageUrl
            creatorSlug
          }
        }`,
      }),
    })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        if (respostaCompleta.data && respostaCompleta.data.allCommunities) {
          const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
          setComunidades(comunidadesVindasDoDato);
        } else {
          console.error('Erro na resposta da API:', respostaCompleta);
        }
      })
      .catch((error) => {
        console.error('Erro ao fazer a requisição:', error);
      });
  }, []);

  function handleCriaComunidade(e) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);

    const comunidade = {
      title: dadosDoForm.get('title'),
      imageUrl: dadosDoForm.get('image'),
      creatorSlug: githubUser,
    };

    fetch('/api/comunidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comunidade),
    })
      .then(async (response) => {
        const dados = await response.json();
        const novaComunidade = dados.registroCriado;

        // Adiciona a nova comunidade no início do array
        const comunidadesAtualizadas = [novaComunidade, ...comunidades];

        // Limita a 6 comunidades
        setComunidades(comunidadesAtualizadas.slice(0, 6));
      })
      .catch((error) => {
        console.error('Erro ao criar comunidade:', error);
      });
  }

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem-vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={handleCriaComunidade}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox title="Seguidores" itens={seguidores} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smalltitle">Comunidades({comunidades.length})</h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smalltitle">
              Pessoas da comunidade({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

