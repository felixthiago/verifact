import os
from json import loads

from google import genai
from google.genai import types

from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY = os.getenv("GOOGLE_GENAI_API_KEY")
MODEL_ID = "gemini-2.0-flash"
client = genai.Client(api_key = GEMINI_API_KEY)


def clean_json_string(text: str) -> str:
    import re
    text = re.sub(r'```json\s*|```', '', text)
    return text.strip()

async def refine_claim(raw_claim: str) -> dict:
    prompt = f"""
        **Texto para analise:** {raw_claim}    

        Você é um assistente de checagem de fatos. remova links, hashtags, menções e emoji no texto. Sua tarefa é analisar o texto a seguir e fornecer uma versão concisa e refinada da informação, para uma analise posterior no google fact check tools.
        Considere que o texto pode conter informações imprecisas, exageradas ou irrelevantes, seu objetivo a principio classificar a relevancia impacto da informação, em categorias de três .
        - C1: se referem a informações que são obviamente falsas, e irrelevantes para checagem do google facts, ou seja não possuem impacto relevante, e não devem ser checadas.
        - C2: se referem a informações que possuem um impacto relevante, ou seja podem influenciar um perfil, pensamento ou indaguem, mesmo que de forma sutil o usuario sobre o conhecimento de um fato, e portanto devem ser checadas.
        - C3: se referem a informações que possuem um impacto muito relevante, que certamente influenciam, de forma significativa o usuario sobre seu pensamento e portanto devem ser checadas.
        caso o modelo não consiga identificar o nível de impacto precisamente, deve classificar a informação no nivel C2. 

        caso a informação seja classificada como C1, o modelo deve retornar em claim uma breve analise sobre essa informação, explicando de maneira humorada e concisa o motivo da classificação.
        se for C2 ou C3, 'claims' deve ser uma lista de afirmações curtas e factuais
        caso o modelo receba afirmações dubias de serem checadas pelo google fact check tools, como por exemplo fofocas e rumores, afirmações obvias, classificações incorretas e afirmações pessoais, deve classificar a informação como C1 e explicar de maneira humorada o motivo da classificação.
        ## RETORNE SOMENTE UM JSON SEGUINDO ESTE ESQUEMA, SEM NENHUMA EXPLICAÇÃO ADICIONAL, SEM `, NEM PONTUAÇÃO, NEM FORMATAÇÃO, APENAS O JSON:
        {{
            "claims": "[lista de afirmações refinadas para checagem no google fact check]",
            "categories": "[C1, C2, or C3]",  
        }}
        ```
    """

    try:
        response = client.models.generate_content(
            model = MODEL_ID,
            contents = raw_claim,
            config = types.GenerateContentConfig(
                system_instruction = prompt,
                response_mime_type = 'application/json'
            )
        )
        print(response.text)

        if response.text is None:
            raise ValueError('null response from gemini')
        cleaned_text = clean_json_string(response.text)

        return loads(cleaned_text)

    except Exception as e:
        print(f'erro > {e}')
        return {
            "claims": raw_claim[:300],
            "categories": "C1",
            "error": str(e)
        }

def syntesize_claim(raw_text: str, google_results: list, category: str):
    if not google_results:
        return {
            "verification": "NOT VERIFIED",
            "confidence": "LOW",
            "Explanation": "Nenhuma checagem oficial foi encontrada para este fato específico",
            "Sources": [],
            "Sentimental": "Neutral"
        }

    prompt = f"""
    Você é um assistente de checagem de fatos que agora precisa dar um veredito final sobre um fato checado com informações pelo google fact check tools. Considere:
    - O texto original da afirmação, tendo em vista tom de humor ou contexto social: {raw_text}
    - A categoria de impacto da afirmação: {category} (C1, C2, OU C3 sendo C1 o menos relevante e C3 o mais relevante) 
    - Os resultados de checagem do google fact check tools: {google_results}

    Retorne APENAS um JSON seguindo este esquema:
    {{
        "Verification": "VERIFIED | PARTIALLY VERIFIED | NOT VERIFIED | FALSE",
        "Confidence": "HIGH | MEDIUM | LOW",
        "Explanation": "Explicação concisa de no máximo 2 parágrafos",
        "Bias": "Detecção de viés ou 'None'",
        "Sources": ["Lista de URLs das fontes principais"],
        "Sentiment": "Tom emocional da mensagem original"
    }}
    """
    try:
        response = client.models.generate_content(
            model = MODEL_ID,
            contents = prompt,
            config = types.GenerateContentConfig(
                system_instruction = prompt,
                response_mime_type = "application/json"
            )
        )
        if response.text is None:
            raise ValueError('null response from gemini')
        return loads(response.text)
    
    except Exception as e:
        print(f'erro > {e}')
        return {
            "ERRO": str(e),
            "verification": "NOT VERIFIED",
            "confidence": "LOW",
            "Explanation": "Ocorreu um erro ao sintetizar a informação",
            "Sources": [],
            "Sentiment": "Neutral"
        }
    