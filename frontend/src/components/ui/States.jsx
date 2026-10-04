import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';

export const Loading = ({ label = 'Loading…', slow = false }) => (
  <div role="status" className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <GiDiceTwentyFacesTwenty className="animate-spin text-5xl text-paper [animation-duration:1.4s]" aria-hidden="true" />
    <p className="text-2xl text-paper">{label}</p>
    {slow && (
      <p className="max-w-sm text-lg text-paper/80">
        The server is starting up after a period of inactivity. This can take up to a minute.
      </p>
    )}
  </div>
);

export const ErrorState = ({ title = 'Something went wrong', message, onRetry }) => (
  <div role="alert" className="index-card mx-auto max-w-md pt-2 text-center">
    <h2 className="text-3xl text-redpen">{title}</h2>
    <p className="mt-4 text-xl">{message}</p>
    {onRetry && (
      <button type="button" className="btn mt-5" onClick={onRetry}>Try again</button>
    )}
  </div>
);

export const EmptyState = ({ title, children, action }) => (
  <div className="index-card mx-auto max-w-md pt-2 text-center">
    <h2 className="text-3xl">{title}</h2>
    <div className="mt-4 text-xl">{children}</div>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
