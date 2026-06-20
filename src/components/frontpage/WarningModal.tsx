'use client';

interface WarningModalProps {
  activeOrderId: string;
  message?: string;
  onClose: () => void;
}

export function WarningModal({ activeOrderId, message, onClose }: WarningModalProps) {
  const handleGoToRoom = () => {
    window.location.assign(`/trade-room.html?order=${activeOrderId}`);
  };

  const defaultMsg = 'Ya tienes un pedido activo en curso. Por favor finalízalo o cancélalo antes de pedir de nuevo.';
  const displayMsg = message || defaultMsg;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="warnTitle">
      <div className="modal-panel code-panel" style={{ background: '#0b1326' }}>
        <button className="close code-close" onClick={onClose} type="button" aria-label="Cerrar">×</button>
        
        <div className="code-top" style={{ background: 'linear-gradient(110deg, #ff4e50, #f9d423)', padding: '24px 30px' }}>
          <span className="controller" style={{ fontSize: '36px' }}>⚠️</span>
          <div>
            <h2 id="warnTitle" style={{ fontSize: '24px', fontWeight: 1000, margin: 0 }}>PEDIDO EN CURSO</h2>
            <p id="warnSubtitle" style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.95 }}>
              Tienes una sesión de intercambio activa.
            </p>
          </div>
        </div>

        <div className="status-box error" style={{ margin: '20px 24px', padding: '14px', borderRadius: '14px', fontSize: '14px', lineHeight: '1.5' }}>
          {displayMsg}
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <button 
            className="bulk-submit enabled" 
            onClick={handleGoToRoom} 
            type="button"
            style={{ width: '100%', fontSize: '16px', padding: '16px' }}
          >
            🚪 IR A MI SALA DE INTERCAMBIO
          </button>
          
          <button 
            onClick={onClose} 
            type="button"
            style={{
              width: '100%',
              marginTop: '12px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: '#bdcae6',
              padding: '12px',
              borderRadius: '14px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            VOLVER AL CREADOR
          </button>
        </div>
      </div>
    </div>
  );
}
