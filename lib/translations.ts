/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Este arquivo contém todas as strings da UI para internacionalização (i18n).
export const translations = {
  'pt-br': {
    // Header
    virtualTryOn: 'Provador Virtual',
    modelLabel: 'Modelo:',
    viewPlans: "Ver planos de assinatura",
    backToLibrary: "Voltar para a biblioteca de modelos",
    language: 'Idioma',

    // StartScreen
    beYourOwnModel: 'Seja a Modelo da Sua Própria Marca.',
    startScreenSubtitle: "Poupe horas de ensaios fotográficos. Envie uma foto sua para se tornar a modelo e adicione as roupas da sua loja para criar looks incríveis para suas redes sociais e e-commerce.",
    createMyModel: 'Criar Minha Modelo',
    startScreenInstructions: 'Selecione uma foto nítida e de corpo inteiro. Fotos apenas do rosto também funcionam, mas corpo inteiro é preferível para melhores resultados.',
    startScreenDisclaimer: "Ao enviar, você concorda em não criar conteúdo prejudicial, explícito ou ilegal. Este serviço é apenas para uso criativo e responsável.",
    yourDigitalModel: 'Sua Modelo Digital',
    dragToSeeTransform: 'Arraste o controle deslizante para ver sua transformação.',
    generatingYourModel: 'Gerando sua modelo...',
    generationFailed: 'A Geração Falhou',
    tryAgain: 'Tentar Novamente',
    useDifferentPhoto: 'Usar Foto Diferente',
    saveAndContinue: 'Salvar e Continuar',
    backToLibraryLink: '← Voltar para a biblioteca',
    yourModels: 'Seus Modelos',
    selectOrCreateModel: 'Selecione um modelo para começar a criar looks ou crie um novo.',
    createNewModel: 'Criar Novo Modelo',

    // NameModelModal
    nameYourModel: 'Nomear Modelo',
    nameModelPrompt: 'Dê um nome à sua nova modelo para salvá-la em sua biblioteca.',
    nameModelPlaceholder: 'Ex: Modelo Ana, Verão 2024...',
    saveModel: 'Salvar Modelo',

    // Canvas
    yourModelWillAppear: 'Seu modelo aparecerá aqui.',
    zoomIn: 'Zoom',
    shareImage: 'Compartilhar imagem',
    downloadImage: 'Baixar imagem',
    refineImage: 'Refinar imagem',
    changeBackground: 'Mudar fundo',
    animateLook: 'Animar look',

    // LoadingOverlay
    loadingMessageDefault: 'Carregando...',

    // OutfitStack
    currentLook: 'Look Atual',
    saveLook: 'Salvar',
    lookSaved: 'Salvo',
    baseModel: 'Modelo Base',
    removeLastGarment: 'Remover último item',
    outfitStackEmpty: 'Seus itens vestidos aparecerão aqui. Selecione um item do guarda-roupa abaixo.',
    
    // WardrobePanel
    products: 'Produtos',
    importFromEcommerce: 'Importar de E-commerce',
    importFromUrl: 'Importar de URL',
    addNewProduct: 'Adicionar novo produto do seu dispositivo',
    selectItem: 'Selecionar',
    wearItems: 'Vestir Itens',
    wardrobeEmpty: 'Os produtos da sua loja aparecerão aqui.',

    // FavoritesPanel
    savedLooks: 'Looks Salvos',
    favoritesEmpty: 'Seus looks salvos aparecerão aqui.',
    favoritesEmptySubtitle: "Clique no ícone de coração para salvar um look.",
    wearLook: 'Vestir',
    deleteLook: 'Excluir look',
    
    // PosePanel
    customizePose: 'Personalizar Pose',
    describePose: 'Descreva a pose...',
    poseSuggestion1: 'Pose de catálogo, vista frontal',
    poseSuggestion2: 'Mostrando detalhes da roupa, close-up',
    poseSuggestion3: 'Pose casual, mãos nos bolsos',
    poseSuggestion4: 'Andando, captura de movimento',

    // Mobile Nav
    mobileNavProducts: 'Produtos',
    mobileNavFavorites: 'Favoritos',
    mobileNavPose: 'Pose',
    mobileNavAssistant: 'Assistente',

    // ZoomModal
    zoomedViewAlt: 'Visualização ampliada do look',
    closeZoomView: 'Fechar visualização ampliada',
    
    // BackgroundModal
    changeBackgroundTitle: 'Mudar Fundo',
    generatingBackground: 'Gerando novo fundo...',
    presetOptions: 'Opções Predefinidas',
    customizeWithText: 'Personalizar com Texto',
    generate: 'Gerar',
    customizeWithImage: 'Personalizar com Imagem',
    clickToUpload: 'Clique para enviar uma imagem',
    fileSelected: 'Arquivo selecionado:',
    fileFormats: 'PNG, JPG, etc.',
    backgroundName_studio_dramatic: 'Estúdio Dramático',
    backgroundName_sunny_day_park: 'Parque Ensolarado',
    backgroundName_rooftop_sunset: 'Pôr do Sol no Terraço',
    backgroundName_studio_backdrop_1: 'Fundo de Estúdio 1',
    backgroundName_beach_background: 'Fundo de Praia',
    backgroundName_city_street: 'Rua da Cidade',
    backgroundPromptPlaceholder: "Ex: uma rua de Paris, uma praia ao pôr do sol...",
    
    // RefineModal
    editPhoto: 'Editar Foto',
    editingYourImage: 'Editando sua imagem...',
    describeChange: 'Descreva a mudança que você quer fazer:',
    refinePlaceholder: 'Ex: Remova a pulseira, adicione um bolso na camisa...',
    applyEdit: 'Aplicar Edição',
    refineSuggestion1: "faça o jeans parecer mais desgastado",
    refineSuggestion2: "mude a cor da camisa para vermelho",
    refineSuggestion3: "adicione um cinto de couro",
    refineSuggestion4: "torne a iluminação mais dramática",
    
    // SubscriptionModal
    ourPlans: 'Nossos Planos',
    chooseYourPlan: 'Escolha o plano ideal para você',
    plansSubtitle: "Comece gratuitamente e faça upgrade a qualquer momento para desbloquear recursos poderosos e levar sua marca para o próximo nível.",
    starterPlan: 'Iniciante',
    starterPrice: 'Grátis',
    starterDesc: 'Para experimentar o básico.',
    starterFeature1: "10 looks por mês",
    starterFeature2: "5 produtos no guarda-roupa",
    starterFeature3: "Imagens com marca d'água",
    continueFree: "Continuar Grátis",
    creatorPlan: 'Criador',
    creatorPrice: 'R$49',
    creatorPriceSuffix: '/mês',
    creatorDesc: 'Para criadores e pequenas lojas.',
    creatorFeature1: "150 looks por mês",
    creatorFeature2: "100 produtos no guarda-roupa",
    creatorFeature3: "Sem marca d'água",
    creatorFeature4: "Poses e fundos premium",
    creatorFeature5: "Suporte prioritário por email",
    chooseCreatorPlan: 'Escolher Plano Criador',
    mostPopular: 'Mais Popular',
    proPlan: 'Loja Pro',
    proPrice: 'R$199',
    proDesc: 'Para e-commerce estabelecido.',
    proFeature1: "Looks ilimitados",
    proFeature2: "Produtos ilimitados",
    proFeature3: "Qualidade de imagem 4K",
    proFeature4: "Múltiplos usuários",
    proFeature5: "Acesso à API (Em breve)",
    chooseProPlan: 'Escolher Plano Loja Pro',

    // EcommerceModal
    importProductCatalog: 'Importar Catálogo de Produtos',
    importSubtitle: "Conecte sua loja para importar seus produtos diretamente para o guarda-roupa.",
    shopifyDesc: 'Sincronize produtos da sua loja Shopify.',
    wooCommerceDesc: 'Sincronize produtos do seu site WordPress.',
    connect: 'Conectar',
    shopifyPlaceholder: 'sualoja.myshopify.com',
    wooCommercePlaceholder: 'https://www.sualoja.com',
    connectingTo: 'Conectando com',
    demoFunctionality: 'Funcionalidade de Demonstração',

    // ShareModal
    shareLook: 'Compartilhar Look',
    shareSubtitle: "Exporte sua criação para suas redes sociais favoritas ou baixe a imagem.",
    lookToShareAlt: 'Look para compartilhar',
    downloadAndPost: 'Baixe e poste no Instagram',
    copyLink: 'Copiar Link',
    linkCopied: 'Link Copiado!',
    downloadImageBtn: 'Baixar Imagem',
    shareText: "Confira meu novo look criado com o Provador Virtual! #provadorvirtual #moda #ia",

    // UrlImportModal
    importFromUrlTitle: 'Importar de URL',
    importingYourImage: 'Importando sua imagem...',
    importUrlSubtitle: 'Cole o link de uma imagem de produto da internet para adicioná-la ao seu guarda-roupa.',
    imageUrlLabel: 'URL da Imagem',
    productNameLabel: 'Nome do Produto',
    preview: 'Visualização',
    addToWardrobe: 'Adicionar ao Guarda-Roupa',
    imageUrlPlaceholder: 'https://exemplo.com/imagem.png',
    productNamePlaceholder: 'Ex: Camisa de Linho Azul',
    previewAlt: 'Visualização da imagem',
    
    // AnimateModal
    animateLookTitle: 'Animar Look',
    generatingVideo: 'A geração de vídeo é um processo demorado. Agradecemos a sua paciência!',
    downloadVideo: 'Baixar Vídeo',
    currentLookLabel: 'Look Atual',
    describeMovement: 'Descreva o movimento',
    animationPromptPlaceholder: 'Ex: caminhando em uma passarela, dançando em uma praia...',
    apiKeyRequired: "A geração de vídeo requer uma chave de API do Google AI Studio.",
    learnMoreBilling: "Saiba mais sobre preços",
    selectApiKey: "Selecionar Chave de API",
    generateVideo: "Gerar Vídeo",

    // ChatPanel
    aiAssistant: 'Assistente IA',
    chatWelcome: 'Olá! 👋 Como posso te ajudar a montar o look perfeito hoje?',
    chatError: 'Desculpe, não consegui processar sua solicitação. Tente novamente.',
    typeYourMessage: 'Digite sua mensagem...',
    chatSystemInstruction: 'Você é um assistente de moda amigável para o aplicativo Provador Virtual. Ajude os usuários com dicas de estilo, perguntas sobre o aplicativo ou sugestões de looks. Seja conciso, prestativo e use emojis para deixar a conversa mais leve.',

    // Footer
    createdBy: 'Criado por',
    remixIdea1: "Ideia de remix: Gerar um lookbook compartilhável.",
    remixIdea2: "Ideia de remix: Integrar uma API de e-commerce para encontrar itens similares.",
    remixIdea3: "Ideia de remix: Adicionar acessórios como chapéus, óculos de sol ou bolsas.",
    remixIdea4: "Ideia de remix: Criar uma 'pontuação de estilo' para os looks.",
    remixIdea5: "Ideia de remix: Permitir que os usuários salvem seus looks favoritos.",
    remixIdea6: "Ideia de remix: Gerar diferentes combinações de cores para as roupas.",

    // lib/utils.ts (error messages)
    errorFileNotSupported: "O tipo de arquivo '{mimeType}' não é suportado. Por favor, use um formato como PNG, JPEG ou WEBP.",
    errorFileGeneric: "Formato de arquivo não suportado. Por favor, envie um formato de imagem como PNG, JPEG ou WEBP.",
    errorUrlImport: 'Falha ao importar da URL. Verifique se o link da imagem está correto e tente novamente.',
    errorVideoGeneration: 'Falha ao gerar o vídeo',
    errorOutfitGeneration: 'Falha ao gerar o look',
    errorModelCreation: 'Falha ao criar o modelo',
    errorImageLoad: 'Não foi possível carregar a imagem. Verifique a URL.',
    errorWardrobeItem: 'Falha ao carregar o item do guarda-roupa.',
  },
  'en': {
    // Header
    virtualTryOn: 'Virtual Try-On',
    modelLabel: 'Model:',
    viewPlans: "View subscription plans",
    backToLibrary: "Back to model library",
    language: 'Language',

    // StartScreen
    beYourOwnModel: 'Be Your Own Brand’s Model.',
    startScreenSubtitle: "Save hours on photoshoots. Upload your photo to become the model and add your store's clothes to create amazing looks for your social media and e-commerce.",
    createMyModel: 'Create My Model',
    startScreenInstructions: 'Select a sharp, full-body photo. Face-only photos also work, but a full body is preferred for best results.',
    startScreenDisclaimer: "By submitting, you agree not to create harmful, explicit, or illegal content. This service is for creative and responsible use only.",
    yourDigitalModel: 'Your Digital Model',
    dragToSeeTransform: 'Drag the slider to see your transformation.',
    generatingYourModel: 'Generating your model...',
    generationFailed: 'Generation Failed',
    tryAgain: 'Try Again',
    useDifferentPhoto: 'Use Different Photo',
    saveAndContinue: 'Save and Continue',
    backToLibraryLink: '← Back to library',
    yourModels: 'Your Models',
    selectOrCreateModel: 'Select a model to start creating looks, or create a new one.',
    createNewModel: 'Create New Model',
    
    // NameModelModal
    nameYourModel: 'Name Your Model',
    nameModelPrompt: 'Give your new model a name to save it to your library.',
    nameModelPlaceholder: 'Ex: Ana Model, Summer 2024...',
    saveModel: 'Save Model',

    // Canvas
    yourModelWillAppear: 'Your model will appear here.',
    zoomIn: 'Zoom',
    shareImage: 'Share image',
    downloadImage: 'Download image',
    refineImage: 'Refine image',
    changeBackground: 'Change background',
    animateLook: 'Animate look',

    // LoadingOverlay
    loadingMessageDefault: 'Loading...',

    // OutfitStack
    currentLook: 'Current Look',
    saveLook: 'Save',
    lookSaved: 'Saved',
    baseModel: 'Base Model',
    removeLastGarment: 'Remove last item',
    outfitStackEmpty: 'Your worn items will appear here. Select an item from the wardrobe below.',
    
    // WardrobePanel
    products: 'Products',
    importFromEcommerce: 'Import from E-commerce',
    importFromUrl: 'Import from URL',
    addNewProduct: 'Add new product from your device',
    selectItem: 'Select',
    wearItems: 'Wear Items',
    wardrobeEmpty: "Your store's products will appear here.",

    // FavoritesPanel
    savedLooks: 'Saved Looks',
    favoritesEmpty: 'Your saved looks will appear here.',
    favoritesEmptySubtitle: "Click the heart icon to save a look.",
    wearLook: 'Wear',
    deleteLook: 'Delete look',

    // PosePanel
    customizePose: 'Customize Pose',
    describePose: 'Describe the pose...',
    poseSuggestion1: 'Catalog pose, front view',
    poseSuggestion2: 'Showing clothing details, close-up',
    poseSuggestion3: 'Casual pose, hands in pockets',
    poseSuggestion4: 'Walking, motion capture',

    // Mobile Nav
    mobileNavProducts: 'Products',
    mobileNavFavorites: 'Favorites',
    mobileNavPose: 'Pose',
    mobileNavAssistant: 'Assistant',

    // ZoomModal
    zoomedViewAlt: 'Zoomed view of the look',
    closeZoomView: 'Close zoomed view',

    // BackgroundModal
    changeBackgroundTitle: 'Change Background',
    generatingBackground: 'Generating new background...',
    presetOptions: 'Preset Options',
    customizeWithText: 'Customize with Text',
    generate: 'Generate',
    customizeWithImage: 'Customize with Image',
    clickToUpload: 'Click to upload an image',
    fileSelected: 'File selected:',
    fileFormats: 'PNG, JPG, etc.',
    backgroundName_studio_dramatic: 'Dramatic Studio',
    backgroundName_sunny_day_park: 'Sunny Park',
    backgroundName_rooftop_sunset: 'Rooftop Sunset',
    backgroundName_studio_backdrop_1: 'Studio Backdrop 1',
    backgroundName_beach_background: 'Beach Background',
    backgroundName_city_street: 'City Street',
    backgroundPromptPlaceholder: "Ex: a street in Paris, a beach at sunset...",

    // RefineModal
    editPhoto: 'Edit Photo',
    editingYourImage: 'Editing your image...',
    describeChange: 'Describe the change you want to make:',
    refinePlaceholder: 'Ex: Remove the bracelet, add a pocket to the shirt...',
    applyEdit: 'Apply Edit',
    refineSuggestion1: "make the jeans look more worn",
    refineSuggestion2: "change the shirt color to red",
    refineSuggestion3: "add a leather belt",
    refineSuggestion4: "make the lighting more dramatic",

    // SubscriptionModal
    ourPlans: 'Our Plans',
    chooseYourPlan: 'Choose the perfect plan for you',
    plansSubtitle: "Start for free and upgrade anytime to unlock powerful features and take your brand to the next level.",
    starterPlan: 'Starter',
    starterPrice: 'Free',
    starterDesc: 'To try out the basics.',
    starterFeature1: "10 looks per month",
    starterFeature2: "5 products in wardrobe",
    starterFeature3: "Images with watermark",
    continueFree: "Continue Free",
    creatorPlan: 'Creator',
    creatorPrice: '$9',
    creatorPriceSuffix: '/mo',
    creatorDesc: 'For creators and small shops.',
    creatorFeature1: "150 looks per month",
    creatorFeature2: "100 products in wardrobe",
    creatorFeature3: "No watermark",
    creatorFeature4: "Premium poses & backgrounds",
    creatorFeature5: "Priority email support",
    chooseCreatorPlan: 'Choose Creator Plan',
    mostPopular: 'Most Popular',
    proPlan: 'Store Pro',
    proPrice: '$39',
    proDesc: 'For established e-commerce.',
    proFeature1: "Unlimited looks",
    proFeature2: "Unlimited products",
    proFeature3: "4K image quality",
    proFeature4: "Multiple users",
    proFeature5: "API Access (Coming Soon)",
    chooseProPlan: 'Choose Pro Plan',

    // EcommerceModal
    importProductCatalog: 'Import Product Catalog',
    importSubtitle: "Connect your store to import your products directly into the wardrobe.",
    shopifyDesc: 'Sync products from your Shopify store.',
    wooCommerceDesc: 'Sync products from your WordPress site.',
    connect: 'Connect',
    shopifyPlaceholder: 'yourstore.myshopify.com',
    wooCommercePlaceholder: 'https://www.yourstore.com',
    connectingTo: 'Connecting with',
    demoFunctionality: 'Demo Functionality',

    // ShareModal
    shareLook: 'Share Look',
    shareSubtitle: "Export your creation to your favorite social media or download the image.",
    lookToShareAlt: 'Look to share',
    downloadAndPost: 'Download and post to Instagram',
    copyLink: 'Copy Link',
    linkCopied: 'Link Copied!',
    downloadImageBtn: 'Download Image',
    shareText: "Check out my new look created with the Virtual Try-On app! #virtualtryon #fashion #ai",
    
    // UrlImportModal
    importFromUrlTitle: 'Import from URL',
    importingYourImage: 'Importing your image...',
    importUrlSubtitle: 'Paste a link to a product image from the internet to add it to your wardrobe.',
    imageUrlLabel: 'Image URL',
    productNameLabel: 'Product Name',
    preview: 'Preview',
    addToWardrobe: 'Add to Wardrobe',
    imageUrlPlaceholder: 'https://example.com/image.png',
    productNamePlaceholder: 'Ex: Blue Linen Shirt',
    previewAlt: 'Image preview',

    // AnimateModal
    animateLookTitle: 'Animate Look',
    generatingVideo: 'Video generation is a time-consuming process. We appreciate your patience!',
    downloadVideo: 'Download Video',
    currentLookLabel: 'Current Look',
    describeMovement: 'Describe the movement',
    animationPromptPlaceholder: 'Ex: walking on a runway, dancing on a beach...',
    apiKeyRequired: "Video generation requires a Google AI Studio API key.",
    learnMoreBilling: "Learn more about pricing",
    selectApiKey: "Select API Key",
    generateVideo: "Generate Video",

    // ChatPanel
    aiAssistant: 'AI Assistant',
    chatWelcome: 'Hello! 👋 How can I help you create the perfect look today?',
    chatError: 'Sorry, I couldn\'t process your request. Please try again.',
    typeYourMessage: 'Type your message...',
    chatSystemInstruction: 'You are a friendly fashion assistant for the Virtual Try-On app. Help users with style tips, questions about the app, or outfit suggestions. Be concise, helpful, and use emojis to make the conversation lighter.',

    // Footer
    createdBy: 'Created by',
    remixIdea1: "Remix idea: Generate a shareable lookbook.",
    remixIdea2: "Remix idea: Integrate an e-commerce API to find similar items.",
    remixIdea3: "Remix idea: Add accessories like hats, sunglasses, or bags.",
    remixIdea4: "Remix idea: Create a 'style score' for outfits.",
    remixIdea5: "Remix idea: Allow users to save their favorite outfits.",
    remixIdea6: "Remix idea: Generate different colorways for garments.",
    
    // lib/utils.ts (error messages)
    errorFileNotSupported: "The file type '{mimeType}' is not supported. Please use a format like PNG, JPEG, or WEBP.",
    errorFileGeneric: "Unsupported file format. Please upload an image format like PNG, JPEG, or WEBP.",
    errorUrlImport: 'Failed to import from URL. Please check the image link is correct and try again.',
    errorVideoGeneration: 'Failed to generate video',
    errorOutfitGeneration: 'Failed to generate outfit',
    errorModelCreation: 'Failed to create model',
    errorImageLoad: 'Could not load the image. Please check the URL.',
    errorWardrobeItem: 'Failed to load wardrobe item.',
  }
};
