import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Trophy, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Level {
  name: string;
  range: string;
  description: string;
  color: string;
  icon: JSX.Element;
}

const levels: Level[] = [
  {
    name: "Aprendiz do Saber",
    range: "1-5 certificados",
    description: "Início da jornada de aprendizado, descobrindo novos conhecimentos.",
    color: "#4ade80",
    icon: <Award className="w-6 h-6 text-green-400" />,
  },
  {
    name: "Explorador Determinado",
    range: "6-15 certificados",
    description: "Avançando na exploração de diferentes áreas de conhecimento.",
    color: "#60a5fa",
    icon: <Trophy className="w-6 h-6 text-blue-400" />,
  },
  {
    name: "Guardião da Sabedoria",
    range: "16-30 certificados",
    description: "Consolidando conhecimentos e compartilhando com outros.",
    color: "#c084fc",
    icon: <Award className="w-6 h-6 text-purple-400" />,
  },
  {
    name: "Mestre Estrategista",
    range: "31-50 certificados",
    description: "Demonstrando habilidades avançadas e aplicando o aprendizado de forma estratégica.",
    color: "#fbbf24",
    icon: <Trophy className="w-6 h-6 text-yellow-400" />,
  },
  {
    name: "Senhor do Conhecimento",
    range: "51-75 certificados",
    description: "Excelência em múltiplas áreas, sendo referência dentro da comunidade de aprendizado.",
    color: "#f87171",
    icon: <Award className="w-6 h-6 text-red-400" />,
  },
  {
    name: "Lendário Mentor",
    range: "76-100 certificados",
    description: "Influenciando e guiando outros no caminho do conhecimento.",
    color: "#fbbf24",
    icon: <Trophy className="w-6 h-6 text-yellow-400" />,
  },
  {
    name: "Titã da Sabedoria",
    range: "101+ certificados",
    description: "Nível supremo de conhecimento e contribuição excepcional para a empresa.",
    color: "#ec4899",
    icon: <Award className="w-6 h-6 text-pink-400" />,
  },
];

const Journey = () => {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select(`
          *,
          course:courses(title)
        `)
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return data;
    },
  });

  const totalCertificates = certificates?.length || 0;
  const currentLevel = levels.find((level) => {
    const [min, max] = level.range.split("-").map(n => parseInt(n) || Infinity);
    return totalCertificates >= min && totalCertificates <= max;
  }) || levels[0];

  const nextLevel = levels[levels.indexOf(currentLevel) + 1];
  const progressToNextLevel = () => {
    const [min, max] = currentLevel.range.split("-").map(n => parseInt(n) || Infinity);
    const range = max - min;
    const current = totalCertificates - min;
    return Math.min((current / range) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-i2know-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Sua Jornada</h1>
        <p className="text-i2know-text-secondary">
          Avançando na exploração de diferentes áreas de conhecimento.
        </p>
      </div>

      {/* Progress Section */}
      <div className="bg-i2know-card rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{currentLevel.name}</h2>
            <p className="text-i2know-text-secondary">{totalCertificates} certificados</p>
          </div>
          <div className="text-right">
            <Trophy className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        <Progress value={progressToNextLevel()} className="h-2" />
        <p className="text-sm text-i2know-text-secondary">
          Próximo nível: {nextLevel?.name} ({nextLevel?.range} certificados restantes)
        </p>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((level) => (
          <Card
            key={level.name}
            className={`p-6 bg-i2know-card border-none ${
              currentLevel.name === level.name ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">{level.name}</h3>
              {level.icon}
            </div>
            <p className="text-sm text-i2know-text-secondary mb-2">{level.range}</p>
            <p className="text-sm text-i2know-text-secondary">{level.description}</p>
          </Card>
        ))}
      </div>

      {/* Certificates Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Seus Certificados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates?.map((cert) => (
            <Card key={cert.id} className="p-4 bg-i2know-card border-none">
              <div className="flex items-center space-x-4">
                <Award className="w-8 h-8 text-i2know-accent" />
                <div>
                  <h4 className="font-medium">{cert.course.title}</h4>
                  <p className="text-sm text-i2know-text-secondary">
                    {new Date(cert.issued_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journey;