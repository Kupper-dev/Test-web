import React, { useEffect } from 'react';
import '../styles/suite-section.css';

export function ItFlowSection() {
  useEffect(() => {
    // 1. SVG Signal Path Scroll Animation
    const handlePathScroll = () => {
      const container = document.querySelector(".it-flow-cards");
      const svgPaths = document.querySelector(".it-network-paths");
      if (!container || !svgPaths) return;

      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      let progress = (vh - rect.top) / (vh + rect.height);
      progress = Math.max(0, Math.min(1, progress));

      const dashOffset = -(3200 * progress);
      svgPaths.style.setProperty("--it-dash-offset", `${dashOffset}px`);
      const uses = svgPaths.querySelectorAll("use");
      uses.forEach((u) => {
        u.style.strokeDashoffset = `${dashOffset}px`;
      });
    };

    // 2. Ticket Track Feed Scroll Animation
    const handleFeedScroll = () => {
      const stacks = document.querySelectorAll("[data-it-feed]");
      if (!stacks.length) return;
      const vh = window.innerHeight;

      stacks.forEach((stack) => {
        const track = stack.querySelector(".it-ticket-track");
        if (!track) return;
        const rect = stack.getBoundingClientRect();
        let progress = (vh - rect.top) / (vh + rect.height);
        progress = Math.max(0, Math.min(1, progress));
        const translateY = track.scrollHeight * 0.35 * progress;
        track.style.transform = `translateY(${-translateY}px)`;
      });
    };

    const onScroll = () => {
      requestAnimationFrame(() => {
        handlePathScroll();
        handleFeedScroll();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="it-flow-section">
      <span className="ticket-eyebrow">
        <svg width="10" height="12" viewBox="0 0 10 12" fill="var(--c-azul)" style={{ marginRight: 2, verticalAlign: 'middle' }}>
          <polygon points="0,0 10,6 0,12" />
        </svg>
        Sistematización IT
      </span>
      <h2>¿Qué áreas conecta IT Support Flow?</h2>
      <div className="it-flow-cards">

        {/* 1. Ventas / Mesa de Ayuda IT */}

        <div className="it-card-wrapper">
          <div className="it-card">
            <h3 className="it-card__title">Gestión de Helpdesk IT</h3>
            <p>Conecta canales de soporte, gestiona solicitudes técnicas en tiempo real y asigna tickets a los ingenieros de soporte con predicción de nivel de severidad.</p>
            <div className="it-card__preview">
              <div className="it-card__stage">
                <div className="it-ticket-stack" data-it-feed>
                  <div className="it-ticket-track">
                    <div className="it-ticket-card">
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '15px 15px 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '60%' }}>
                          <p style={{ fontWeight: 500, lineHeight: 1.5, color: '#1f1c1b', fontSize: '16px', letterSpacing: '-0.48px', margin: 0 }}>Solicitud #101</p>
                          <p style={{ fontWeight: 400, lineHeight: 1.4, color: '#585858', fontSize: '12px', letterSpacing: '-0.36px', margin: 0 }}>Renovación de Certificados SSL</p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#ECFDF5', padding: '4px 8px 4px 6px', borderRadius: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#02A270', flexShrink: 0 }}></div>
                          <p style={{ fontWeight: 400, fontSize: '12px', letterSpacing: '-0.36px', color: '#02A270', margin: 0, whiteSpace: 'nowrap' }}>Completado</p>
                        </div>
                      </div>
                      <div style={{ margin: '12px 15px 15px', border: 'none', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <p style={{ fontWeight: 400, lineHeight: 1.4, color: '#585858', fontSize: '12px', letterSpacing: '-0.36px', margin: 0 }}>Solicitante:</p>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <p style={{ fontWeight: 400, lineHeight: 1.4, color: '#1f1c1b', fontSize: '12px', letterSpacing: '-0.36px', margin: 0 }}>Infraestructura Cloud</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: 'rgba(31,28,27,0.04)', padding: '4px 8px', borderRadius: '6px' }}>
                            <p style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '-0.42px', color: '#1f1c1b', margin: 0 }}>SLA 99.9%</p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <p style={{ fontSize: '11px', color: '#585858', margin: 0 }}>Prioridad: <span style={{ color: '#02A270', fontWeight: 600 }}>Alta</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connector 1 */}
        <div className="it-connector">
          <div className="it-connector__dot"></div>
          <svg className="it-connector__line" width="6" height="80" viewBox="0 0 6 80" fill="none">
            <line x1="3" y1="0" x2="3" y2="80" stroke="#FFFFFF" strokeWidth="6" />
            <line x1="3" y1="0" x2="3" y2="80" stroke="#C8C2B5" strokeWidth="2" strokeDasharray="6 6" className="it-marching-line" />
          </svg>
          <div className="it-connector__dot"></div>
        </div>

        {/* 2. Operaciones IT / Mantenimiento */}
        <div className="it-card-wrapper">
          <div className="it-card">
            <h3 className="it-card__title">Operaciones e Infraestructura IT</h3>
            <p>Supervisa servidores, despliega parches de seguridad y coordina mantenimientos preventivos en la red sin interrupciones.</p>
            <div className="it-card__preview">
              <div className="it-card__stage">
                <div className="it-ticket-stack" data-it-feed>
                  <div className="it-ticket-track">
                    <div className="it-ticket-card">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '15px 15px 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <p style={{ fontWeight: 500, lineHeight: 1.5, color: '#1f1c1b', fontSize: '16px', letterSpacing: '-0.48px', margin: 0 }}>Tarea IT # 23</p>
                          <p style={{ fontWeight: 400, lineHeight: 1.4, color: '#585858', fontSize: '12px', letterSpacing: '-0.36px', margin: 0 }}>Actualización Kernel Kubernetes Cluster</p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#EFF4FF', padding: '4px 8px 4px 6px', borderRadius: '6px', alignSelf: 'flex-start' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB', flexShrink: 0 }}></div>
                          <p style={{ fontWeight: 400, fontSize: '12px', letterSpacing: '-0.36px', color: '#2563EB', margin: 0, whiteSpace: 'nowrap' }}>En Curso</p>
                        </div>
                      </div>
                      <div style={{ margin: '12px 15px 15px', border: 'none', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <p style={{ fontWeight: 400, lineHeight: 1.4, color: '#585858', fontSize: '12px', letterSpacing: '-0.36px', margin: 0 }}>Ingeniero: <span style={{ color: '#1f1c1b' }}>Carlos Herrera</span></p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                          <div className="it-progress-bar">
                            <div style={{ width: '60%', height: '100%', background: '#FDBF00', borderRadius: '3px' }}></div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ fontWeight: 500, fontSize: '11px', letterSpacing: '-0.33px', color: '#1f1c1b', margin: 0 }}>60% Completado</p>
                            <p style={{ fontWeight: 400, fontSize: '11px', letterSpacing: '-0.33px', color: '#585858', margin: 0 }}>6 de 10 Nodos</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connector 2 */}
        <div className="it-connector">
          <div className="it-connector__dot"></div>
          <svg className="it-connector__line" width="6" height="80" viewBox="0 0 6 80" fill="none">
            <line x1="3" y1="0" x2="3" y2="80" stroke="#FFFFFF" strokeWidth="6" />
            <line x1="3" y1="0" x2="3" y2="80" stroke="#C8C2B5" strokeWidth="2" strokeDasharray="6 6" className="it-marching-line" />
          </svg>
          <div className="it-connector__dot"></div>
        </div>

        {/* 3. Servicio al Cliente / Incidentes IT */}
        <div className="it-card-wrapper">
          <div className="it-card">
            <h3 className="it-card__title">Atención de Incidentes & Fallos</h3>
            <p>Centraliza las alertas de monitoreo del sistema en un solo dashboard, gestiona incidentes críticos y responde con rapidez ante contingencias.</p>
            <div className="it-card__preview">
              <div className="it-card__stage">
                <div className="it-ticket-stack" data-it-feed>
                  <div className="it-ticket-track">
                    <div className="it-ticket-card">
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '15px 15px 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '60%' }}>
                          <p style={{ fontWeight: 500, lineHeight: 1.5, color: '#1f1c1b', fontSize: '16px', letterSpacing: '-0.48px', margin: 0 }}>Incidente # 76</p>
                          <p style={{ fontWeight: 400, lineHeight: 1.4, color: '#585858', fontSize: '12px', letterSpacing: '-0.36px', margin: 0 }}>Servidor de BD Caído (Cluster 2)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#EFF4FF', padding: '4px 8px 4px 6px', borderRadius: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB', flexShrink: 0 }}></div>
                          <p style={{ fontWeight: 400, fontSize: '12px', letterSpacing: '-0.36px', color: '#2563EB', margin: 0, whiteSpace: 'nowrap' }}>En Revisión</p>
                        </div>
                      </div>
                      <div style={{ margin: '12px 15px 15px', border: 'none', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#FDE8F0', padding: '4px 8px 4px 6px', borderRadius: '6px' }}>
                            <p style={{ fontWeight: 400, fontSize: '12px', letterSpacing: '-0.36px', color: '#F32A73', margin: 0 }}>Severidad Crítica</p>
                          </div>
                          <div style={{ display: 'flex', gap: '2px', alignItems: 'center', fontSize: '12px' }}>
                            <p style={{ color: '#585858', margin: 0 }}>Tipo: <span style={{ color: '#1f1c1b' }}>Hardware</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connector 3 */}
        <div className="it-connector">
          <div className="it-connector__dot"></div>
          <svg className="it-connector__line" width="6" height="80" viewBox="0 0 6 80" fill="none">
            <line x1="3" y1="0" x2="3" y2="80" stroke="#FFFFFF" strokeWidth="6" />
            <line x1="3" y1="0" x2="3" y2="80" stroke="#C8C2B5" strokeWidth="2" strokeDasharray="6 6" className="it-marching-line" />
          </svg>
          <div className="it-connector__dot"></div>
        </div>

        {/* 4. Gestión de Equipamiento & Accesos IT */}
        <div className="it-card-wrapper">
          <div className="it-card">
            <h3 className="it-card__title">Gestión de Inventario y Licencias IT</h3>
            <p>Administra los dispositivos de la empresa, autoriza accesos de seguridad y mantiene la infraestructura auditada al 100%.</p>
            <div className="it-card__preview">
              <div className="it-card__stage">
                <div className="it-ticket-stack" data-it-feed>
                  <div className="it-ticket-track">
                    <div className="it-ticket-card">
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '15px 15px 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '60%' }}>
                          <p style={{ fontWeight: 500, lineHeight: 1.5, color: '#1f1c1b', fontSize: '16px', letterSpacing: '-0.48px', margin: 0 }}>Activo # 28</p>
                          <p style={{ fontWeight: 400, lineHeight: 1.4, color: '#585858', fontSize: '12px', letterSpacing: '-0.36px', margin: 0 }}>MacBook Pro M3 Max — Asignación Dev</p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#EFF4FF', padding: '4px 8px 4px 6px', borderRadius: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB', flexShrink: 0 }}></div>
                          <p style={{ fontWeight: 400, fontSize: '12px', letterSpacing: '-0.36px', color: '#2563EB', margin: 0, whiteSpace: 'nowrap' }}>Asignado</p>
                        </div>
                      </div>
                      <div style={{ margin: '12px 15px 15px', border: 'none', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#EFF4FF', padding: '4px 8px', borderRadius: '6px' }}>
                            <p style={{ fontWeight: 400, fontSize: '12px', letterSpacing: '-0.36px', color: '#2563EB', margin: 0 }}>Auditado OK</p>
                          </div>
                          <div style={{ display: 'flex', gap: '2px', alignItems: 'center', fontSize: '12px' }}>
                            <p style={{ color: '#585858', margin: 0 }}>Hardware: <span style={{ color: '#1f1c1b' }}>Laptop</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

