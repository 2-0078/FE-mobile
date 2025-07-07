import { AlertItem } from './AlertProvider';

const alertTypeConfig: Record<string, { className: string; position: string }> =
  {
    basic: {
      className: 'toast-basic animate-fadeIn',
      position: 'bottom-[3vh] left-1/2 translate-x-[-50%]',
    },
    wiggle: {
      className: 'toast-basic animate-wiggle',
      position: 'bottom-[3vh] left-1/2 translate-x-[-50%]',
    },
    error: {
      className: 'toast-error animate-headShake',
      position: 'bottom-[3vh] left-1/2 translate-x-[-50%]',
    },
    heartBeat: {
      className: 'toast-basic animate-heartBeat',
      position: 'bottom-[3vh] left-1/2 translate-x-[-50%]',
    },
    midBig: {
      className: 'toast-basic animate-headShake',
      position: 'bottom-[3vh] left-1/2 translate-x-[-50%]',
    },
  };

interface AlertProps {
  alert: AlertItem;
}

const Alert = ({ alert, ...props }: AlertProps) => {
  const config = alertTypeConfig[alert.type] || alertTypeConfig.basic;

  return (
    <div className={`fixed z-[9999] ${config.position}`}>
      <div
        role="alert"
        className={`flex items-center justify-center animate-fadeIn ${config.className}`}
        {...props}
      >
        <span className={`text-[0.875rem] font-bold whitespace-nowrap`}>
          {alert.message}
        </span>
      </div>
    </div>
  );
};

export default Alert;
