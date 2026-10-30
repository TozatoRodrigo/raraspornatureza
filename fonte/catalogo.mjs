// Lista de plantas à venda. Para mudar: edite as linhas abaixo (id, nome, nome científico, descrição, preço em reais
// e, se houver, o porte) e a data em `atualizadaEm`; depois rode `node fonte/montar.mjs` na raiz do projeto.
// `genero` (filtro do site) sai da primeira palavra do nome.
export const atualizadaEm = '30 de outubro';

export const plantas = [
  ['aglaonema-frozen', 'Aglaonema Frozen', 'Aglaonema spp.', 'Folhagem prateada com toques de verde, bem rústica e de fácil manutenção.', 30],
  ['aglaonema-frozen-green', 'Aglaonema Frozen Green', 'Aglaonema spp.', 'Variação esverdeada da Frozen, folhagem prateada e resistente.', 30],
  ['aglaonema-heng-heng', 'Aglaonema Heng Heng', 'Aglaonema spp.', 'Folhagem colorida em tons vibrantes, cultivar valorizada por colecionadores.', 40],
  ['aglaonema-lukisan-cinta', 'Aglaonema Lukisan Cinta', 'Aglaonema spp.', 'Padrão de folhagem único, com manchas e nervuras decorativas.', 40],
  ['aglaonema-orange-kom-kom', 'Aglaonema Orange Kom Kom', 'Aglaonema spp.', 'Folhagem em tons alaranjados, uma das cultivares mais coloridas do gênero.', 40],
  ['aglaonema-pink-aurora', 'Aglaonema Pink Aurora', 'Aglaonema spp.', 'Folhagem rosada, tolerante à sombra e de crescimento compacto.', 30],
  ['aglaonema-pink-dalmatian', 'Aglaonema Pink Dalmatian', 'Aglaonema spp.', 'Manchas rosa espalhadas pela folhagem, lembrando o padrão que dá nome à cultivar.', 40],
  ['aglaonema-salmon-fantasy', 'Aglaonema Salmon Fantasy', 'Aglaonema spp.', 'Tons salmão na folhagem, rústica e ideal para ambientes internos.', 30],
  ['aglaonema-sparkin-sara', 'Aglaonema Sparkin Sara', 'Aglaonema spp.', 'Folhagem prateada com brilho característico.', 30],
  ['aglaonema-white-joy', 'Aglaonema White Joy', 'Aglaonema spp.', 'Folhagem clara, quase branca, com nervuras verdes contrastantes.', 30],
  ['aglaonema-red-stardust', 'Aglaonema Red Stardust', 'Aglaonema spp.', 'Pintas avermelhadas espalhadas pela folhagem verde escura.', 30],
  ['alocasia-lukiwan-pequena', 'Alocasia Lukiwan', 'Alocasia spp.', 'Folhas onduladas e texturizadas, porte compacto.', 30, 'pequena'],
  ['alocasia-macrorrhiza-variegata-grande', 'Alocasia Macrorrhiza Variegata', 'Alocasia macrorrhiza', 'Variegação branca marcante em folhagem grande e imponente.', 100, 'grande'],
  ['alocasia-macrorrhiza-variegata-pequena', 'Alocasia Macrorrhiza Variegata', 'Alocasia macrorrhiza', 'Variegação branca marcante, exemplar em formação.', 30, 'pequena'],
  ['alocasia-tiny-dancer', 'Alocasia Tiny Dancer', 'Alocasia spp.', 'Folhas estreitas e onduladas, porte pequeno e elegante.', 60],
  ['amydrium-medium-silver', "Amydrium Medium 'Silver'", 'Amydrium medium', 'Folhagem prateada e fenestrada, trepadeira de crescimento vigoroso.', 60],
  ['anthurium-luxurians-inhotim', 'Anthurium Luxurians', 'Anthurium luxurians', 'Folhagem enrugada e texturizada, uma das espécies mais cobiçadas por colecionadores.', 700, 'grande, linhagem Inhotim'],
  ['begonia-venosa', 'Begonia Venosa', 'Begonia venosa', 'Folhas suculentas e aveludadas, resistente e de fácil cultivo.', 40],
  ['begonia-caracol', 'Begonia Caracol', 'Begonia spp.', 'Folhagem espiralada e ornamental, bastante procurada por colecionadores.', 30],
  ['drimiopsis-maculata', 'Drimiopsis Maculata', 'Drimiopsis maculata', 'Folhas manchadas em formato de coração, bulbosa e rústica.', 20],
  ['epipremnum-pinnatum-skeleton-key', "Epipremnum Pinnatum 'Skeleton Key'", 'Epipremnum pinnatum', 'Folhas alongadas e perfuradas quando madura, trepadeira vigorosa.', 40],
  ['epipremnum-pinnatum-variegata', 'Epipremnum Pinnatum Variegata', 'Epipremnum pinnatum', 'Variegação branca em folhagem perfurada, trepadeira vigorosa.', 40],
  ['ficus-alii-variegata-m', 'Ficus Alii Variegata', "Ficus binnendijkii 'Alii'", 'Folhas longas e estreitas com variegação, porte arbustivo.', 100, 'média'],
  ['maranta-ruby', 'Maranta Ruby', 'Maranta leuconeura', 'Folhagem com tons avermelhados, movimenta as folhas conforme a luz do dia.', 20],
  ['philodendron-billietiae-g', 'Philodendron Billietiae', 'Philodendron billietiae', 'Folhas alongadas com pecíolo alaranjado, bastante procurada por colecionadores.', 70, 'grande'],
  ['philodendron-billietiae-m', 'Philodendron Billietiae', 'Philodendron billietiae', 'Folhas alongadas com pecíolo alaranjado, exemplar em formação.', 50, 'média'],
  ['philodendron-cascata', 'Philodendron Cascata', 'Philodendron spp.', 'Hábito trepador e pendente, ideal para vasos suspensos.', 30],
  ['piper-magnificum', 'Piper Magnificum', 'Piper spp.', 'Folhagem grande e texturizada, nervuras marcantes.', 80],
  ['platycerium-stemaria-laurentii', "Platycerium Stemaria 'Laurentii'", 'Platycerium stemaria', 'Espécie de chifre-de-veado com folhas escudo bem desenvolvidas.', 300],
  ['monstera-acuminata', 'Monstera Acuminata', 'Monstera acuminata', 'Folhas pequenas e brilhantes, espécie trepadeira de Monstera menos comum.', 10],
].map(([id, nome, cientifico, descricao, preco, porte]) => {
  const g = nome.split(' ')[0].toLowerCase();
  const genero = { aglaonema: 'aglaonema', alocasia: 'alocasia', philodendron: 'philodendron', anthurium: 'anthurium',
    monstera: 'monstera', platycerium: 'platycerium', begonia: 'begonia' }[g] ?? 'outras';
  return { id, nome, cientifico, descricao, preco, porte: porte ?? null, genero };
});

// Ordem e rótulos dos filtros
export const generos = [
  ['aglaonema', 'Aglaonema'], ['alocasia', 'Alocasia'], ['philodendron', 'Philodendron'], ['anthurium', 'Anthurium'],
  ['platycerium', 'Platycerium'], ['monstera', 'Monstera'], ['begonia', 'Begônia'], ['outras', 'Outras'],
];
