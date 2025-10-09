export function OrbitalLoader() {
  return (
    <div className="flex items-center justify-center">
      <div className="loader" />

      <style>{`
        .loader {
          width: 11px;
          aspect-ratio: 1;
          border-radius: 50%;
          background-color: #4facfe;
          display: grid;
          animation: l22-0 2s infinite linear;
          transition: background-color 0.5s ease-in-out;
        }

        .loader:before,
        .loader:after {
          content: "";
          grid-area: 1/1;
          margin: 15%;
          border-radius: 50%;
          background: inherit;
          transform: rotate(0deg) translate(150%);
          animation: l22 1.5s infinite;
        }

        .loader:after {
          animation-delay: -.5s;
        }

        @keyframes l22-0 {
          100% { transform: rotate(1turn); }
        }

        @keyframes l22 {
          100% { transform: rotate(1turn) translate(150%); }
        }
      `}</style>
    </div>
  )
}
