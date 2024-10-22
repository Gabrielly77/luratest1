import { SiteClient } from 'datocms-client'

export default async function recebedorDeRequests(request, response) {
  if (request.method === 'POST') {
    const TOKEN = '1981e11569c662aa0626ca2e66d208'
    const client = new SiteClient(TOKEN)

    // Validar os dados, antes de sair cadastrando
    const { title, imageUrl, membros } = request.body; // Captura o título e a URL da imagem da comunidade

    // Cria a comunidade com a imagem
    const registroCriado = await client.items.create({
      itemType: '979906', // ID do Model de 'Communities' criado pelo Dato
      title, // Título da comunidade
      imageUrl, // URL da imagem da comunidade
      // Adicione outras propriedades da comunidade se necessário
    })

    // Para adicionar membros, você pode fazer isso aqui
    // Supondo que você tenha um modelo para membros no DatoCMS
    if (membros) {
      for (const membro of membros) {
        await client.items.create({
          itemType: 'YOUR_MEMBERS_MODEL_ID', // Substitua pelo ID do seu modelo de membros
          nome: membro.nome,
          url: membro.url,
          imagem: membro.imagem, // Inclua a URL da imagem do membro
          comunidadeId: registroCriado.id // Associa o membro à comunidade criada
        })
      }
    }

    console.log(registroCriado)

    response.json({
      dados: 'Comunidade criada com sucesso!',
      registroCriado: registroCriado
    })
    return
  }

  response.status(404).json({
    message: 'Ainda não temos nada no GET, mas no POST tem!'
  })
}

