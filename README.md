# Sistema de Gestão de Pedidos e Rastreio

Aplicação para gestão e acompanhamento de pedidos do setor têxtil do Agreste Pernambucano. Esta primeira entrega inclui a interface visual do frontend; a integração com API ainda não está implementada.

## Frontend

A interface permite navegar por quatro telas:

- **Painel geral:** resumo da produção, pedidos recentes e próximas entregas.
- **Novo pedido:** formulário para cadastrar um pedido de demonstração.
- **Consultar pedidos:** tabela com busca por pedido, cliente ou produto e filtro por status.
- **Histórico:** linha do tempo com atualizações de exemplo.

O layout é responsivo e usa uma paleta escura com azul-petróleo e terracota.

## Como executar

Não é necessário instalar dependências. Abra `index.html` em um navegador ou sirva a pasta com um servidor HTTP estático. Por exemplo, com Python:

```bash
python -m http.server 8000
```

Em seguida, acesse <http://localhost:8000>.

## Estrutura

```text
.
├── app.js       # Navegação, filtros e dados de demonstração em memória
├── index.html   # Estrutura das quatro telas
├── styles.css   # Estilos responsivos e tema visual
└── README.md
```

Os pedidos cadastrados no formulário existem apenas na sessão atual do navegador e não são persistidos nem enviados a uma API.
