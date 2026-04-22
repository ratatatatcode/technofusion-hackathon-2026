export function SiteFooter({ extended = false }: { extended?: boolean }) {
  return (
    <footer className="pixel-footer">
      <div className="ground-strip" />
      <p>
        {extended ? (
          <>
            © 2026 CAMPUSQUEST · MADE WITH <span className="red">♥</span> · 8-BIT FOR THE PLANET 🌍
          </>
        ) : (
          <>© 2026 CAMPUSQUEST</>
        )}
      </p>
    </footer>
  );
}
