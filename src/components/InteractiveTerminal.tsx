import * as React from "react";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function InteractiveTerminal({ darkMode }: { darkMode: boolean }) {
  const commands = [
    { cmd: 'ls skills/', category: 'vision', title: 'Computer Vision' },
    { cmd: 'cat web-apis.txt', category: 'web', title: 'Web & APIs' },
    { cmd: 'python data_ai.py', category: 'data', title: 'Datos & IA' },
    { cmd: 'docker ps', category: 'micro', title: 'Microservicios' },
  ];

  const content = {
    vision: [
      '📹 Detección/segmentación',
      '🗂️  Generación de datasets',
      '☁️  Generación de Point Cloud',
      '👁️  Estéreo Visión',
    ],
    web: [
      '⚛️  React+Tailwind / Angular+Bootstrap',
      '🚀 Laravel / Node.js / FastAPI',
      '🔐 Auth, caching, testing',
      '🔌 WebSocket Broadcasting',
    ],
    data: [
      '🔄 ETL / feature stores',
      '📊 Métricas & monitoreo',
      '🤖 Entrenamiento de modelos',
      '📈 Análisis predictivo',
    ],
    micro: [
      '🐳 Docker / Kubernetes',
      '📨 Kafka / RabbitMQ',
      '👀 Observabilidad',
      '⚡ Escalado automático',
    ],
  };

  const [activeCategory, setActiveCategory] = React.useState<'vision' | 'web' | 'data' | 'micro'>('vision');
  const [displayedLines, setDisplayedLines] = React.useState<string[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);

  React.useEffect(() => {
    const currentCmd = commands.find(c => c.category === activeCategory);
    if (!currentCmd) return;

    setIsTyping(true);
    setDisplayedLines([`$ ${currentCmd.cmd}`, '']);

    const lines = content[activeCategory];
    let lineIndex = 0;

    const interval = setInterval(() => {
      if (lineIndex < lines.length) {
        setDisplayedLines(prev => [...prev, lines[lineIndex]]);
        lineIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [activeCategory]);

  return (
    <Card className={`border-muted shadow-lg font-mono overflow-hidden ${
      darkMode 
        ? 'bg-slate-950 dark:bg-slate-900 text-green-400' 
        : 'bg-slate-100 text-slate-800'
    }`}>
      <CardHeader className={`border-b pb-3 ${
        darkMode
          ? 'bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 border-slate-700'
          : 'bg-gradient-to-r from-slate-200 to-slate-300 border-slate-300'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
            </div>
            <span className={`text-sm ml-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              kevin@portfolio:~
            </span>
          </div>
          <Brain className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {commands.map((cmd) => (
            <Button
              key={cmd.category}
              size="sm"
              variant={activeCategory === cmd.category ? 'secondary' : 'outline'}
              onClick={() => setActiveCategory(cmd.category as any)}
              className={activeCategory === cmd.category 
                ? darkMode
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-500 font-mono text-xs shadow-md shadow-green-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500 font-mono text-xs shadow-md shadow-blue-500/20'
                : darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-green-400 border-slate-600 font-mono text-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 font-mono text-xs'}
            >
              {cmd.title}
            </Button>
          ))}
        </div>
        
        <div className={`rounded p-3 min-h-[180px] text-sm space-y-1 ${
          darkMode 
            ? 'bg-black/50 border border-slate-800' 
            : 'bg-white border-2 border-slate-300'
        }`}>
          {displayedLines.map((line, i) => (
            <div key={i} className={
              i === 0 
                ? darkMode ? 'text-cyan-400 font-semibold' : 'text-blue-600 font-semibold'
                : darkMode ? 'text-green-300' : 'text-slate-700'
            }>
              {line}
              {i === displayedLines.length - 1 && isTyping && (
                <span className={`inline-block w-2 h-4 ml-1 animate-pulse ${
                  darkMode ? 'bg-green-400' : 'bg-blue-500'
                }`} />
              )}
            </div>
          ))}
          {!isTyping && displayedLines.length > 2 && (
            <div className={darkMode ? 'text-cyan-400 mt-2' : 'text-blue-600 mt-2'}>
              $ <span className="animate-pulse">▊</span>
            </div>
          )}
        </div>

        <div className={`text-xs italic text-center ${
          darkMode ? 'text-slate-500' : 'text-slate-600'
        }`}>
          💡 Click en los comandos para explorar áreas clave
        </div>
      </CardContent>
    </Card>
  );
}
