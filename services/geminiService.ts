/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                // Handle the case where result is not a string (e.g., ArrayBuffer)
                // For simplicity, we'll resolve with an empty string, but you might want more robust handling
                resolve('');
            }
        };
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
        },
    };
}

export const generateModelImage = async (file: File): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    const imagePart = await fileToGenerativePart(file);
    // This prompt is carefully crafted to create a clean base model for virtual try-on.
    // It instructs the AI to remove the background but crucially keep the original clothing,
    // which makes the before/after comparison more effective and less jarring for the user.
    const prompt = `Crie uma imagem fotorrealista de corpo inteiro de uma modelo de moda com base na pessoa nesta foto. A modelo deve ter uma expressão e pose neutras, em pé e virada para a frente. **É crucial preservar 100% intacta a roupa original da pessoa na foto, sem alterações.** Remova apenas o fundo original e substitua-o por um fundo de estúdio cinza, simples e neutro. O foco é criar um modelo base limpo e reutilizável para o provador virtual, mantendo a aparência EXATA da pessoa (rosto, corpo, cabelo) sem NENHUMA alteração, incluindo suas roupas originais. Garanta que a saída seja uma imagem nítida da modelo com suas roupas originais em um fundo cinza.`;

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
        return `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
    }

    throw new Error("A geração da imagem do modelo falhou ou o formato da resposta é inválido.");
};

export const dressModel = async (
    baseModelFile: File,
    garmentFiles: File[],
    poseInstruction: string,
    backgroundFile?: File,
    backgroundPrompt?: string,
    refinementPrompt?: string
): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    const modelPart = await fileToGenerativePart(baseModelFile);
    const garmentParts = await Promise.all(garmentFiles.map(fileToGenerativePart));

    const parts: any[] = [modelPart, ...garmentParts];
    
    // This prompt has been heavily reinforced to make model fidelity the absolute, non-negotiable priority.
    const promptLines = [
        "**TAREFA PRINCIPAL: VESTIR A MODELO COM FIDELIDADE ABSOLUTA**",
        "Sua única tarefa é pegar a modelo base e vesti-la com as novas peças de roupa fornecidas. NADA MAIS.",
        "",
        "**DIRETRIZ INVIOLÁVEL: A MODELO ORIGINAL É SAGRADA**",
        "A modelo na imagem base NÃO PODE ser alterada. O rosto, corpo, cabelo, tom de pele e todas as características físicas devem permanecer 100% IDÊNTICOS. A imagem final deve ser A MESMA PESSOA, apenas com roupas diferentes.",
        "",
        "**DIRETRIZ CRÍTICA: FIDELIDADE TOTAL ÀS PEÇAS DE ROUPA**",
        "As peças de roupa fornecidas devem ser replicadas na modelo com 100% de precisão. NÃO FAÇA NENHUMA ALTERAÇÃO na aparência das roupas.",
        "Isto inclui, mas não se limita a:",
        "- **CORES:** Mantenha as cores exatas. Não altere a tonalidade, saturação ou brilho.",
        "- **PADRÕES E ESTAMPAS:** Reproduza todas as linhas, formas e padrões exatamente como na imagem original.",
        "- **DETALHES:** Preserve todos os detalhes: botões, zíperes, laços, cintos, costuras, logotipos, etc.",
        "- **TEXTURA E CAIMENTO:** O material e a forma como a roupa se dobra devem ser consistentes com o item original, ajustado de forma realista ao corpo da modelo.",
        "A roupa na imagem final deve ser instantaneamente reconhecível como o item exato fornecido. NÃO INVENTE ou modifique NENHUM aspecto da roupa.",
        "",
        "**LISTA DE PROIBIÇÕES ABSOLUTAS (Qualquer violação é uma falha):**",
        "1. **NÃO ADICIONE TATUAGENS:** É estritamente proibido adicionar tatuagens ou qualquer marcação na pele da modelo que não existia na foto original.",
        "2. **NÃO ADICIONE ACESSÓRIOS:** Não adicione NENHUM item extra que não foi enviado como uma imagem de produto. Isso inclui, mas não se limita a: joias (colares, brincos, pulseiras, anéis), bolsas, chapéus, óculos, cintos, etc.",
        "3. **NÃO ALTERE A FISIONOMIA:** Não mude o rosto, a maquiagem ou a expressão da modelo.",
        "4. **NÃO ALTERE O CORPO:** Não mude o tipo de corpo ou as proporções da modelo.",
        "",
        "**Processo Passo a Passo:**",
        "1. **Análise da Modelo Base:** Identifique a modelo e suas características imutáveis.",
        "2. **Remoção da Roupa Original:** Remova digitalmente TODAS as roupas que a modelo está vestindo.",
        "3. **Aplicação da Nova Roupa:** Vista a modelo com as novas peças fornecidas, seguindo estritamente as diretrizes de fidelidade, e ajuste de forma realista.",
    ];
    
    if (poseInstruction) {
        promptLines.push(`- **Pose:** A modelo deve estar na seguinte pose: ${poseInstruction}.`);
    }

    if (backgroundFile) {
        const backgroundPart = await fileToGenerativePart(backgroundFile);
        parts.push(backgroundPart);
        promptLines.push(`- **Fundo:** Use a imagem de fundo fornecida.`);
    } else if (backgroundPrompt) {
        promptLines.push(`- **Fundo:** O fundo deve ser: ${backgroundPrompt}.`);
    }

    if (refinementPrompt) {
        promptLines.push(`- **Refinamento:** Após vestir a modelo, aplique esta edição: "${refinementPrompt}".`);
    }

    const prompt = promptLines.join('\n');
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
        return `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
    }

    throw new Error("A geração do look falhou ou o formato da resposta é inválido.");
};