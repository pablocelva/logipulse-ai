import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { WebSearchPort } from '../../domain/ports/web-search.port';

@Injectable()
export class TavilyWebSearchAdapter implements WebSearchPort {
  private readonly logger = new Logger(TavilyWebSearchAdapter.name);

  async search(query: string): Promise<string> {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey || apiKey === 'tvly-tu_api_key_de_tavily_aqui') {
      this.logger.warn('⚠️ TAVILY_API_KEY no configurada. Se usará contexto simulado.');
      return 'Contexto de prueba: Alto flujo vehicular reportado en el sector oriente durante hora punta.';
    }

    try {
      this.logger.log(`🔍 Ejecutando búsqueda real en Tavily API para: "${query}"...`);
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: apiKey,
        query: query,
        search_depth: 'basic',
        max_results: 3,
      });

      const results = response.data.results || [];
      return results.map((r: any) => `${r.title}: ${r.content}`).join('\n');
    } catch (error) {
      this.logger.error(`Error en búsqueda Tavily API: ${error.message}`);
      return 'No se pudo obtener información adicional de la web en este momento.';
    }
  }
}
