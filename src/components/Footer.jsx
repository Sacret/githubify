/**
 *  Copyright with link to the author
 */
export function Author() {
  return (
    <span className="author">
      © 2015–{new Date().getFullYear()}&nbsp;
      <a href="https://sacret.ru/" target="_blank" rel="noreferrer">
        Anastasia Abakumova
      </a>
    </span>
  );
}

/**
 *  Footer contains info about the author
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Author />
      </div>
    </footer>
  );
}
