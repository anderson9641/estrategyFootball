import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Configurações
const API_KEY = process.env.VITE_APIKEY; // Recebe a chave como argumento: node scripts/sync-players.js MINHA_CHAVE
const pastaAtual = import.meta.dirname;
const OUTPUT_FILE = path.join(pastaAtual, '../src/dados_times2.json');

if (!API_KEY) {
  console.error('Erro: Você deve fornecer a API Key da API-Football.');
  console.log('Uso: node scripts/sync-players.js SUA_CHAVE_AQUI');
  process.exit(1);
}

// IDs dos 20 times da Série A 2024 (Liga 71 - Brasil) na API-Football
const TEAM_IDS = [
  127, // Flamengo --
  121, // Palmeiras --
  120, // Botafogo --
  1062, // Atletico Mineiro --
  126, // São Paulo --
  130, // Grêmio --
  794, // RB Bragantino --
  124, // Fluminense --
  134, // Athletico Paranaense --
  119, // Internacional --
  131, // Corinthians --
  135, // Cruzeiro --
  133, // Vasco da Gama --
  118, // Bahia --
  136, // Vitória --
  128, //Santos  --
  7848, // Mirassol --
  1198, // Remo --
  132, // Chapecoense --
  147 // Coritiba --
];

async function fetchTeamSquad(teamId) {
  console.log(`Buscando elenco do time ID: ${teamId}...`);
  console.log(`A API_KEY é ${API_KEY}`);
  const response = await fetch(`https://v3.football.api-sports.io/players/squads?team=${teamId}`, {
    method: 'GET',
    headers: {
      "x-apisports-key": `${API_KEY}`
    }
  });

  const data = await response.json();
  
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(JSON.stringify(data.errors));
  }

  return data;
  return null
}

async function sync() {
  const allTeamsData = [];

  for (const id of TEAM_IDS) {
    try {
      const data = await fetchTeamSquad(id);
      
      if (data.response && data.response.length > 0) {
        // Otimizar os dados para manter o JSON leve
        const teamInfo = data.response[0];
        const optimizedData = {
          response: [{
            team: {
              id: teamInfo.team.id,
              name: teamInfo.team.name,
              logo: teamInfo.team.logo
            },
            players: teamInfo.players.map(p => ({
              id: p.id,
              name: p.name,
              age: p.age,
              number: p.number,
              position: p.position,
              photo: p.photo
            }))
          }]
        };
        allTeamsData.push(optimizedData);
      }
      
      // Delay de 1.5s para não estourar o limite de requisições por minuto (Free plan tem limite)
      await new Promise(resolve => setTimeout(resolve, 10000));
      
    } catch (error) {
      console.error(`Erro ao buscar time ${id}:`, error.message);
    }
  }

  if (allTeamsData.length > 0) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allTeamsData, null, 2));
    console.log(`\nSucesso! ${allTeamsData.length} times sincronizados em ${OUTPUT_FILE}`);
  } else {
    console.error('Nenhum dado foi baixado. Verifique sua API Key e conexão.');
  }
}

sync();
