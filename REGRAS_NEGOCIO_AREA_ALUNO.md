# Regras de Negócio — Área do Aluno GYMX

> Documento de referência para produto, engenharia, UX e compliance (LGPD).  
> Versão: 1.1 · Data: julho/2026 · Escopo: portal/app logado do aluno.

---

## Atores do sistema

| Ator | Descrição |
|------|-----------|
| **Aluno** | Usuário final com matrícula ativa, inadimplente, congelada ou em onboarding |
| **Professor/Personal** | Profissional que prescreve treinos, avalia e comunica com o aluno |
| **Recepção** | Atendimento presencial, cadastro, check-in manual e suporte |
| **Sistema GYMX** | Plataforma (app + backend + integrações) |
| **Controlador LGPD** | Academia GYMX (titular dos dados) |
| **Operador LGPD** | Fornecedores de pagamento, wearables, biometria, e-mail/push |

---

## Políticas comerciais definidas (stakeholder — jul/2026)

| Política | Definição GYMX |
|----------|----------------|
| **Aviso prévio de cancelamento** | 60 dias entre solicitação e encerramento efetivo da matrícula |
| **Multa rescisória** | Cálculo **pró-rata** pelo tempo usufruído **+** multa de **10% a 30%** sobre o saldo restante do contrato |
| **Congelamento (trancamento)** | **60 dias** por plano (Livre, Plus e Elite), por ciclo contratual/ano |
| **Campanha de retenção por inatividade** | Sequência de 3 e-mails: (1) após **14 dias** sem check-in; (2) **21 dias** após o 1º e-mail; (3) **30 dias** após o 2º e-mail — cada disparo só ocorre se o aluno ainda não tiver retomado frequência |

**Fórmula de multa rescisória (referência):**

```
saldo_restante = valor_total_contrato - (valor_mensal × meses_usufruidos)
multa_percentual = entre 10% e 30% do saldo_restante (conforme plano/negociação)
valor_final = ajuste_pro_rata + multa_percentual
```

---

## 1. Cadastro, perfil e onboarding

**Pré-condições:** aluno possui CPF válido, e-mail ativo e matrícula iniciada (presencial ou digital).

| # | Regra |
|---|-------|
| 1.1 | **Dado** que o aluno inicia o cadastro, **quando** preenche nome completo, CPF, data de nascimento, e-mail, telefone e senha, **então** o sistema valida os campos, cria conta em status `onboarding_pendente` e exige aceite de Termos de Uso e Política de Privacidade antes de liberar a área logada. |
| 1.2 | **Dado** que o aluno não aceitou os termos LGPD, **quando** tenta acessar qualquer módulo logado, **então** o sistema bloqueia o acesso e exibe tela de consentimento obrigatório com registro de data/hora/IP/dispositivo. |
| 1.3 | **Dado** que o aluno concluiu o cadastro básico, **quando** acessa o onboarding, **então** o sistema exige PAR-Q/anamnese de saúde antes de liberar treinos e check-in, classificando respostas em `apto`, `apto_com_restricao` ou `encaminhar_avaliacao`. |
| 1.4 | **Dado** que o PAR-Q indica risco cardiovascular ou lesão aguda, **quando** o aluno tenta iniciar treino prescrito, **então** o sistema bloqueia a ficha e notifica professor/recepção para avaliação presencial. |
| 1.5 | **Dado** que o aluno está apto, **quando** completa verificação de identidade (e-mail + OTP ou validação presencial na recepção), **então** o status da conta muda para `ativo` e o onboarding é marcado como concluído. |
| 1.6 | **Dado** que o aluno está logado, **quando** edita telefone, foto, objetivos ou contato de emergência, **então** o sistema salva imediatamente; alterações em CPF, data de nascimento ou nome exigem revalidação de identidade. |
| 1.7 | **Dado** que o aluno é menor de 18 anos, **quando** conclui cadastro, **então** o sistema exige cadastro e aceite do responsável legal antes de ativar matrícula. |

**Exceções/erros:**
- CPF já cadastrado → exibir opção de recuperar conta ou falar com recepção.
- OTP expirado (15 min) → permitir reenvio limitado a 3 tentativas/hora.
- Anamnese incompleta → redirecionar ao onboarding em qualquer acesso ao portal.

---

## 2. Planos e assinaturas

**Pré-condições:** planos configurados pela academia com regras de fidelidade, horários e benefícios.

| # | Regra |
|---|-------|
| 2.1 | **Dado** que o aluno está em onboarding ou upgrade, **quando** seleciona um plano disponível, **então** o sistema exibe preço, fidelidade mínima, benefícios, horários permitidos e data de início da vigência. |
| 2.2 | **Dado** que o aluno possui plano ativo, **quando** solicita upgrade, **então** o sistema aplica o novo plano na próxima cobrança ou imediatamente (conforme política), calculando pró-rata quando aplicável. |
| 2.3 | **Dado** que o aluno solicita downgrade, **quando** a solicitação é registrada, **então** o downgrade entra em vigor apenas no próximo ciclo de cobrança, mantendo benefícios do plano atual até a data de transição. |
| 2.4 | **Dado** que o aluno está dentro do período de fidelidade, **quando** solicita cancelamento, **então** o sistema registra a solicitação, informa aviso prévio de **60 dias** para encerramento efetivo, calcula multa conforme regra 2.8 e exibe simulação de valores antes da confirmação. |
| 2.5 | **Dado** que o aluno solicita congelamento (trancamento), **quando** a solicitação é aprovada, **então** o sistema suspende cobrança e acesso por até **60 dias** por plano (Livre, Plus ou Elite), registrando início/fim e consumo do saldo de congelamento no ciclo contratual. |
| 2.6 | **Dado** que o plano possui renovação automática, **quando** chega a data de renovação e não há inadimplência, **então** o sistema renova automaticamente e notifica o aluno com comprovante. |
| 2.7 | **Dado** que o congelamento expira sem retorno do aluno, **quando** passam 7 dias do fim do trancamento, **então** o sistema reativa cobrança ou inicia fluxo de cancelamento por inatividade (conforme política). |
| 2.8 | **Dado** que o cancelamento antecipado gera multa, **quando** o sistema calcula o valor rescisório, **então** aplica ajuste **pró-rata** pelo tempo usufruído do contrato e soma multa rescisória de **10% a 30%** sobre o **saldo restante**, exibindo memória de cálculo ao aluno e registrando percentual aplicado por plano ou acordo da recepção. |
| 2.9 | **Dado** que o aluno confirma cancelamento com aviso prévio, **quando** a solicitação é aceita, **então** o sistema agenda encerramento para **D+60**, mantém acesso contratado até a data efetiva e bloqueia renovação automática. |

**Exceções/erros:**
- Plano esgotado por limite de vagas → lista de espera com posição e previsão.
- Cancelamento com multa pendente → bloquear encerramento até quitação ou acordo formal.
- Congelamento solicitado com saldo de 60 dias já consumido → negar trancamento ou oferecer upgrade/negociação com recepção.
- Cancelamento dentro dos 60 dias de aviso prévio → manter cobranças recorrentes até data efetiva; aluno pode desistir da solicitação antes de D+60.

---

## 3. Pagamentos e cobrança

**Pré-condições:** gateway de pagamento integrado; PIX Automático habilitado conforme Bacen.

| # | Regra |
|---|-------|
| 3.1 | **Dado** que o aluno está contratando ou renovando, **quando** escolhe forma de pagamento, **então** o sistema oferece PIX Automático, cartão recorrente e boleto (se habilitado), exibindo taxas, periodicidade e data da primeira cobrança. |
| 3.2 | **Dado** que o aluno autoriza PIX Automático, **quando** confirma no app do banco, **então** o sistema registra mandato de débito, associa ao plano e agenda cobranças recorrentes com notificação prévia de 3 dias. |
| 3.3 | **Dado** que uma cobrança falha, **quando** o sistema detecta inadimplência, **então** inicia contagem de carência (ex.: 3 dias), envia lembrete push/e-mail e exibe banner na área logada. |
| 3.4 | **Dado** que o aluno permanece inadimplente após a carência, **quando** expira o prazo configurado, **então** o sistema bloqueia check-in, agendamento de aulas e liberação de treino, mantendo acesso somente a pagamentos e suporte. |
| 3.5 | **Dado** que o aluno regulariza o pagamento, **quando** a confirmação é recebida do gateway, **então** o sistema reativa acesso em até 15 minutos e registra recibo/nota fiscal disponível para download. |
| 3.6 | **Dado** que o aluno solicita segunda via, **quando** acessa histórico financeiro, **então** o sistema lista cobranças dos últimos 24 meses com status, NF/recibo e opção de contestação em até 30 dias. |
| 3.7 | **Dado** que há estorno ou chargeback, **quando** confirmado pela operadora, **então** o sistema notifica recepção, suspende benefícios e registra auditoria financeira. |

**Exceções/erros:**
- PIX Automático recusado pelo banco → oferecer cartão ou boleto imediatamente.
- Pagamento duplicado → abrir crédito em conta do aluno ou estorno automático em até 5 dias úteis.

---

## 4. Check-in e controle de acesso

**Pré-condições:** catraca/biometria/QR integrados; plano com regras de horário e frequência.

| # | Regra |
|---|-------|
| 4.1 | **Dado** que o aluno possui matrícula ativa e adimplente, **quando** realiza check-in por QR Code no app, **então** o sistema valida plano, horário de funcionamento e libera acesso à catraca por janela de 15 minutos. |
| 4.2 | **Dado** que a unidade suporta biometria facial/digital, **quando** o aluno cadastra biometria com consentimento LGPD, **então** o check-in pode ocorrer sem QR, registrando data/hora/unidade/dispositivo. |
| 4.3 | **Dado** que o plano limita check-ins (ex.: 12/mês), **quando** o aluno atinge o limite, **então** o sistema bloqueia novo check-in e oferece upgrade ou pacote avulso. |
| 4.4 | **Dado** que o aluno está fora do horário permitido pelo plano, **quando** tenta check-in, **então** o sistema nega acesso e informa faixa horária válida e opções de plano. |
| 4.5 | **Dado** que o check-in por geolocalização está habilitado, **quando** o aluno está a até 100 m da unidade, **então** o app permite check-in rápido; fora do raio, exige QR ou biometria na catraca. |
| 4.6 | **Dado** que o aluno realizou check-in, **quando** não registra check-out em aulas com vaga reservada, **então** o sistema mantém presença válida por 3h ou até check-out manual. |
| 4.7 | **Dado** que a academia está fechada (feriado/manutenção), **quando** o aluno tenta check-in, **então** o sistema exibe mensagem institucional e não registra tentativa como frequência. |

**Exceções/erros:**
- QR expirado → gerar novo token a cada 60 segundos.
- Biometria não reconhecida após 3 tentativas → direcionar à recepção com código temporário.

---

## 5. Agendamento de aulas e treinos

**Pré-condições:** grade de aulas publicada; capacidade e professores definidos.

| # | Regra |
|---|-------|
| 5.1 | **Dado** que o aluno possui acesso ativo ao módulo de aulas, **quando** reserva vaga em aula coletiva presencial, **então** o sistema confirma reserva, envia push de confirmação e exibe política de cancelamento. |
| 5.2 | **Dado** que a aula atingiu capacidade máxima, **quando** o aluno tenta reservar, **então** o sistema inclui o aluno na lista de espera com posição e notificação automática se vaga abrir. |
| 5.3 | **Dado** que o aluno possui reserva confirmada, **quando** cancela com antecedência mínima de 2h, **então** a vaga é liberada sem penalidade. |
| 5.4 | **Dado** que o aluno cancela com menos de 2h ou não comparece (no-show), **quando** o horário da aula passa, **então** o sistema registra no-show e aplica penalidade conforme política (ex.: bloqueio de reservas por 48h após 3 no-shows/mês). |
| 5.5 | **Dado** que a aula é híbrida/online, **quando** o aluno reserva modalidade online, **então** o sistema libera link/stream 15 min antes e registra presença por tempo mínimo de 70% da duração. |
| 5.6 | **Dado** que o professor cancela a aula, **quando** a alteração é publicada, **então** todos os alunos reservados recebem push/e-mail com opção de reagendamento automático em aula equivalente. |
| 5.7 | **Dado** que o aluno está inadimplente, **quando** tenta nova reserva, **então** o sistema bloqueia agendamento e direciona para regularização financeira. |

**Exceções/erros:**
- Conflito de horário com outra reserva → impedir dupla reserva no mesmo slot.
- Queda do link online → permitir reposição sem consumir crédito de aula.

---

## 6. Treinos e prescrição

**Pré-condições:** professor vinculado ou protocolo IA habilitado; anamnese concluída.

| # | Regra |
|---|-------|
| 6.1 | **Dado** que o aluno está apto e adimplente, **quando** acessa "Meu Treino", **então** o sistema exibe ficha ativa com exercícios, séries, cargas, descanso e observações do professor. |
| 6.2 | **Dado** que o professor publica nova ficha, **quando** a prescrição é liberada, **então** o aluno recebe notificação e a ficha anterior vai para histórico (somente leitura). |
| 6.3 | **Dado** que a IA prescritiva está ativa, **quando** o aluno registra desempenho abaixo/acima do alvo por 2 sessões consecutivas, **então** o sistema sugere ajuste de carga/volume e aguarda aprovação do professor (modo supervisionado) ou aplica automaticamente (modo autônomo, se habilitado). |
| 6.4 | **Dado** que o aluno conclui treino no app, **quando** marca exercícios como feitos e registra cargas, **então** o histórico fica visível ao aluno e ao professor com data, duração e RPE opcional. |
| 6.5 | **Dado** que não há ficha liberada, **quando** o aluno tenta iniciar treino guiado, **então** o sistema exibe mensagem para agendar avaliação com professor. |
| 6.6 | **Dado** que o aluno reporta dor aguda no treino, **quando** confirma alerta de segurança, **então** o sistema pausa a ficha, sugere exercícios alternativos seguros e notifica o professor. |
| 6.7 | **Dado** que o plano não inclui personal, **quando** o aluno solicita nova prescrição, **então** o sistema oferece protocolo padrão da academia ou upsell de consultoria. |

**Exceções/erros:**
- Sincronização offline de treino → mesclar ao reconectar com timestamp do dispositivo.
- Exercício com vídeo indisponível → exibir descrição textual e imagem estática.

---

## 7. Integração com wearables e apps de saúde

**Pré-condições:** aluno autorizou integração; APIs Apple Health, Google Fit, Garmin, Fitbit, Samsung Health disponíveis.

| # | Regra |
|---|-------|
| 7.1 | **Dado** que o aluno inicia conexão com wearable, **quando** autoriza no app parceiro, **então** o sistema registra consentimento específico LGPD por fonte de dados e escopo (passos, FC, calorias, sono, HRV). |
| 7.2 | **Dado** que a integração está ativa, **quando** ocorre sincronização automática, **então** o sistema importa dados a cada 6h (ou em tempo real se suportado) e exibe última sync na área do aluno. |
| 7.3 | **Dado** que dados de recuperação (sono/HRV) indicam fadiga elevada, **quando** a IA prescritiva está habilitada, **então** o sistema recomenda redução de volume/intensidade no treino do dia. |
| 7.4 | **Dado** que o aluno revoga permissão no wearable, **quando** a revogação é detectada, **então** o sistema interrompe importação, mantém histórico já coletado e remove vínculo ativo. |
| 7.5 | **Dado** que há divergência entre check-in na academia e passos registrados, **quando** o aluno contesta frequência, **então** prevalece o registro de check-in oficial da GYMX. |
| 7.6 | **Dado** que dados importados são incompletos, **quando** falta métrica crítica (ex.: FC), **então** o sistema não bloqueia treino, apenas ignora ajuste automático dependente dessa métrica. |

**Exceções/erros:**
- API do parceiro indisponível → retry exponencial por 24h; notificar aluno se >48h sem sync.
- Dados duplicados de múltiplos wearables → priorizar fonte definida pelo aluno como primária.

---

## 8. Gamificação e engajamento

**Pré-condições:** programa de pontos configurado; política anti-fraude ativa.

| # | Regra |
|---|-------|
| 8.1 | **Dado** que o aluno realiza check-in válido, **quando** o registro é confirmado, **então** o sistema credita pontos base e atualiza streak de frequência. |
| 8.2 | **Dado** que o aluno mantém streak de 7 dias consecutivos com check-in, **quando** o 7º dia é registrado, **então** concede badge "Semana de Ferro" e bônus de pontos. |
| 8.3 | **Dado** que o aluno quebra streak por falta de check-in em dia útil, **quando** passa 24h sem frequência, **então** o streak zera, mas histórico e pontos acumulados permanecem. |
| 8.4 | **Dado** que há desafio mensal ativo, **quando** o aluno atinge meta (ex.: 12 treinos), **então** libera recompensa configurada (desconto, aula avulsa, merch). |
| 8.5 | **Dado** que o ranking social está habilitado, **quando** o aluno opta por participar, **então** exibe posição semanal por pontos; se optar por não participar, oculta do ranking público. |
| 8.6 | **Dado** que o sistema detecta padrão de check-ins fraudulentos (mesmo dispositivo em contas distintas), **quando** a suspeita é confirmada, **então** suspende pontuação e aciona revisão da recepção. |
| 8.7 | **Dado** que o aluno está **14 dias** sem check-in válido, **quando** a regra de retenção é avaliada, **então** o sistema dispara **e-mail de retenção #1** (push opcional) com CTA de retorno e oferta configurável. |
| 8.8 | **Dado** que o e-mail #1 foi enviado e o aluno permanece sem check-in, **quando** passam **21 dias** do disparo do e-mail #1, **então** o sistema dispara **e-mail de retenção #2** com nova mensagem/oferta e registro em histórico de campanhas. |
| 8.9 | **Dado** que o e-mail #2 foi enviado e o aluno permanece sem check-in, **quando** passam **30 dias** do disparo do e-mail #2, **então** o sistema dispara **e-mail de retenção #3** (último da sequência automática) e sinaliza risco alto de churn para recepção/gestão. |
| 8.10 | **Dado** que o aluno realiza check-in após qualquer e-mail de retenção, **quando** o check-in é confirmado, **então** o sistema cancela os próximos disparos da sequência, zera contadores de inatividade e registra conversão da campanha. |

**Exceções/erros:**
- Resgate de recompensa sem estoque → fila de espera ou crédito equivalente.
- Aluno menor de idade → ranking social desabilitado por padrão.
- Aluno com plano congelado → pausar sequência de e-mails de retenção até reativação.
- E-mail #3 enviado sem retorno → encaminhar para fila prioritária de contato humano (recepção/coach).

---

## 9. Comunidade e comunicação

**Pré-condições:** canais de mensagem configurados; templates de notificação aprovados.

| # | Regra |
|---|-------|
| 9.1 | **Dado** que o aluno possui notificações habilitadas, **quando** há lembrete de aula 1h antes, **então** envia push com opção de confirmar presença ou cancelar conforme política. |
| 9.2 | **Dado** que existe mensagem da academia (aviso institucional), **quando** publicada pela recepção/gestão, **então** exibe inbox in-app com confirmação de leitura para avisos críticos. |
| 9.3 | **Dado** que o aluno envia mensagem ao professor, **quando** a conversa é iniciada, **então** o chat fica disponível em horário comercial; mensagens são armazenadas por 5 anos para auditoria de atendimento. |
| 9.4 | **Dado** que o aluno desativa push, **quando** salva preferências, **então** mantém notificações obrigatórias (cobrança, segurança, alteração contratual) via e-mail ou in-app. |
| 9.5 | **Dado** que o aluno reporta abuso em chat/comunidade, **quando** a denúncia é enviada, **então** o sistema oculta conteúdo reportado, notifica moderação e preserva evidências. |
| 9.6 | **Dado** que o vencimento do plano está a 3 dias, **quando** a data se aproxima, **então** envia lembrete de pagamento com link direto para regularização. |

**Exceções/erros:**
- Push não entregue → fallback por e-mail/SMS após 12h.
- Professor indisponível → auto-resposta com SLA de retorno em até 24h úteis.

---

## 10. Avaliação física e evolução

**Pré-condições:** avaliações cadastradas por profissional habilitado (CREF); equipamentos de bioimpedância integrados (opcional).

| # | Regra |
|---|-------|
| 10.1 | **Dado** que o professor realiza avaliação física, **quando** publica resultados, **então** o aluno visualiza medidas, % gordura, peso, circunferências e fotos (se autorizadas) no histórico de evolução. |
| 10.2 | **Dado** que o aluno define meta (ex.: -5% BF em 90 dias), **quando** salva a meta, **então** o sistema acompanha progresso com base nas avaliações e check-ins vinculados. |
| 10.3 | **Dado** que há nova avaliação, **quando** comparada à anterior, **então** exibe gráfico de evolução e destaca variações acima de limiar configurado (±2% BF, ±1 kg). |
| 10.4 | **Dado** que o aluno autoriza uso de fotos de progresso, **quando** faz upload ou recebe da avaliação, **então** armazena com criptografia e permite revogação de consentimento a qualquer momento. |
| 10.5 | **Dado** que passaram 90 dias sem avaliação em plano que inclui acompanhamento, **quando** o prazo expira, **então** notifica aluno e professor para reavaliação. |
| 10.6 | **Dado** que dados de saúde são sensíveis (LGPD Art. 11), **quando** compartilhados com professor, **então** exigem consentimento explícito e registro de finalidade específica. |

**Exceções/erros:**
- Avaliação com dados inconsistentes → sinalizar revisão pelo professor antes de publicar.
- Aluno menor → fotos de evolução exigem consentimento do responsável.

---

## 11. Dados, privacidade e LGPD

**Pré-condições:** política de privacidade publicada; DPO/representante definido; registro de operações de tratamento.

| # | Regra |
|---|-------|
| 11.1 | **Dado** que o aluno utiliza a plataforma, **quando** dados pessoais são tratados, **então** a base legal deve estar documentada (execução de contrato, consentimento ou legítimo interesse conforme o caso). |
| 11.2 | **Dado** que o tratamento envolve dados sensíveis de saúde, **quando** coletados via PAR-Q, avaliação ou wearable, **então** exige consentimento específico e destacado, com opção de revogação sem prejudicar serviços essenciais contratados. |
| 11.3 | **Dado** que o aluno solicita portabilidade, **quando** a solicitação é validada, **então** o sistema exporta dados em formato estruturado (JSON/CSV) em até 15 dias. |
| 11.4 | **Dado** que o aluno solicita exclusão de conta, **quando** não há obrigações legais de retenção pendentes, **então** anonimiza ou elimina dados em até 30 dias, preservando registros fiscais/contratuais pelo prazo legal. |
| 11.5 | **Dado** que o aluno cancela matrícula, **quando** encerra contrato, **então** dados de saúde ficam retidos por até 5 anos (prazo a validar com jurídico) ou período menor se solicitada eliminação e não houver impedimento legal. |
| 11.6 | **Dado** que operadores terceiros processam dados, **quando** integrados (pagamento, biometria, push), **então** contratos devem prever cláusulas de proteção, suboperadores e notificação de incidentes em até 24h. |
| 11.7 | **Dado** que ocorre incidente de segurança com risco ao titular, **quando** confirmado, **então** notificar ANPD e alunos afetados conforme gravidade, com plano de mitigação. |

**Exceções/erros:**
- Solicitação de exclusão com débito aberto → concluir exclusão após quitação ou acordo documentado.
- Portabilidade abrangendo dados de terceiros → exportar apenas dados sob controle da GYMX.

---

## 12. Regras de suspensão/encerramento de conta

**Pré-condições:** políticas de uso aceitas; trilha de auditoria habilitada.

| # | Regra |
|---|-------|
| 12.1 | **Dado** que o aluno não acessa o app nem realiza check-in por 180 dias, **quando** atinge inatividade configurada, **então** o sistema envia aviso de suspensão preventiva e, sem resposta em 30 dias, suspende conta mantendo dados conforme LGPD. |
| 12.2 | **Dado** que o aluno viola termos (fraude, assédio, compartilhamento de credenciais), **quando** confirmado em investigação, **então** suspende acesso imediatamente e notifica com motivo e canal de contestação. |
| 12.3 | **Dado** que o aluno solicita encerramento voluntário, **quando** confirma identidade, **então** inicia fluxo de offboarding com checklist: débitos, equipamentos, cancelamento de PIX Automático e download de dados. |
| 12.4 | **Dado** que a conta é encerrada, **quando** concluído o processo, **então** revoga tokens de sessão, biometria, wearables e acesso à catraca em até 1h. |
| 12.5 | **Dado** que há guarda pós-encerramento, **quando** o prazo legal expira, **então** o sistema elimina/anonimiza dados automaticamente com log de prova de exclusão. |
| 12.6 | **Dado** que o aluno contesta suspensão, **quando** abre ticket em até 10 dias, **então** recepção/gestão revisa e responde em até 5 dias úteis com decisão registrada. |

**Exceções/erros:**
- Encerramento com assinatura PIX ativa → exigir revogação do mandato antes de concluir.
- Reativação após suspensão por inadimplência → somente após quitação integral.

---

## Decisões validadas (stakeholder — jul/2026)

| # | Tema | Decisão |
|---|------|---------|
| ✅ 1 | Carência de cancelamento | **60 dias** de aviso prévio antes do encerramento efetivo |
| ✅ 2 | Multa contratual | **Pró-rata** pelo tempo usufruído **+ 10% a 30%** sobre saldo restante |
| ✅ 3 | Congelamento | **60 dias** por plano (Livre, Plus, Elite) |
| ✅ 11 | Retenção por inatividade | E-mails em **D+14**, **D+21 após e-mail #1** e **D+30 após e-mail #2** sem check-in |

---

## Decisões em aberto (validação stakeholder)

1. **Congelamento:** cobrar taxa administrativa no trancamento?
2. **Multa rescisória:** percentual exato (10%, 20% ou 30%) por plano ou faixa negociável caso a caso?
3. **Inadimplência:** carência de 3, 5 ou 7 dias antes do bloqueio de acesso?
4. **No-show:** quantas faltas toleradas por mês antes de bloqueio de reservas?
5. **IA prescritiva:** modo sempre supervisionado pelo professor ou autônomo para alunos avançados?
6. **Ranking social:** opt-in padrão ou opt-out? Exibir nome completo ou apelido?
7. **Retenção LGPD pós-cancelamento:** 5 anos para dados de saúde ou prazo menor?
8. **Check-in por geolocalização:** raio de 100 m ou 200 m? Obrigatório ou opcional por unidade?
9. **PIX Automático:** oferecer desconto incentivador vs. cartão? Qual percentual?
10. **Menores de idade:** a partir de qual idade permitir conta própria com autorização do responsável?
11. **Aulas online:** tempo mínimo de presença para crédito (70% ou 80%)?
12. **Recompensas de gamificação:** teto mensal de resgates por aluno?

---

## Referência de implementação no código (GYMX atual)

| Rota | Público | Descrição |
|------|---------|-----------|
| `/login` | Público | Autenticação do aluno |
| `/portal` | Aluno logado | Home da área do aluno |
| `/portal/treino` | Aluno logado | Ficha e histórico |
| `/portal/check-in` | Aluno logado | Check-in inteligente |
| `/portal/aulas` | Aluno logado | Agendamentos |
| `/portal/plano` | Aluno logado | Assinatura e pagamentos |
| `/portal/perfil` | Aluno logado | Perfil, LGPD e anamnese |
| `/dashboard` | Staff/admin | Painel operacional (separado do aluno) |

---

*Documento gerado para alinhamento de produto GYMX. Revisar com jurídico (LGPD/contratos), financeiro (PIX Automático) e operações (unidades/catracas) antes de implementação em produção.*
