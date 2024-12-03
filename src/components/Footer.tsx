import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const Footer = () => {
  return (
    <footer className="bg-black/40 mt-12 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Terms Dialog */}
          <Dialog>
            <DialogTrigger className="text-gray-400 hover:text-white transition-colors">
              Termos de Uso
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Termos de Uso</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] mt-4">
                <div className="space-y-6 pr-4">
                  <p className="text-gray-300">O i2know é uma plataforma de e-learning desenvolvida e mantida pela IVEN, destinada exclusivamente ao uso corporativo pelas empresas do grupo VPJ.</p>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">1. Uso da Plataforma</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      <li>Acesso restrito a colaboradores autorizados do grupo VPJ</li>
                      <li>Credenciais de acesso são pessoais e intransferíveis</li>
                      <li>Proibido compartilhar acessos ou conteúdos com terceiros</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">2. Propriedade Intelectual</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      <li>Todo conteúdo é propriedade exclusiva da IVEN/VPJ</li>
                      <li>Proibida reprodução, distribuição ou modificação sem autorização</li>
                      <li>Marcas, logos e nomes são protegidos por direitos autorais</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">3. Responsabilidades</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      <li>Usuários devem manter segurança das credenciais</li>
                      <li>Uso inadequado resultará em suspensão do acesso</li>
                      <li>Empresa reserva direito de modificar ou encerrar acesso</li>
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Privacy Policy Dialog */}
          <Dialog>
            <DialogTrigger className="text-gray-400 hover:text-white transition-colors">
              Política de Privacidade
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Política de Privacidade</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] mt-4">
                <div className="space-y-6 pr-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">1. Coleta de Dados</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      <li>Informações de perfil profissional</li>
                      <li>Dados de uso e progresso educacional</li>
                      <li>Registros de acesso e interações</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">2. Uso dos Dados</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      <li>Análise de desempenho e progresso</li>
                      <li>Personalização da experiência de aprendizado</li>
                      <li>Relatórios gerenciais internos</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">3. Proteção</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      <li>Dados armazenados em ambiente seguro</li>
                      <li>Acesso restrito a pessoal autorizado</li>
                      <li>Conformidade com LGPD</li>
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* About Dialog */}
          <Dialog>
            <DialogTrigger className="text-gray-400 hover:text-white transition-colors">
              Sobre
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Sobre o i2know</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] mt-4">
                <div className="space-y-6 pr-4">
                  <p className="text-gray-300">
                    O i2know é um sistema de aprendizado corporativo desenvolvido pela equipe de tecnologia da IVEN para atender às necessidades específicas de capacitação e desenvolvimento profissional das empresas do grupo VPJ.
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Nossa Missão</h3>
                    <p className="text-gray-300">
                      Fornecer uma plataforma de aprendizado eficiente e personalizada, promovendo o desenvolvimento contínuo dos colaboradores do grupo VPJ.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Características</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      <li>Conteúdo personalizado para nosso negócio</li>
                      <li>Sistema de gamificação exclusivo</li>
                      <li>Integração com processos internos</li>
                      <li>Suporte técnico dedicado</li>
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} i2know - Desenvolvido pela IVEN
        </div>
      </div>
    </footer>
  );
};

export default Footer;