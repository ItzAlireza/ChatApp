export default function ErrMsg({ c, v = "visible", s = "ErrMsg" }) {
  return (
    <div className={s} style={{ visibility: v }}>
      {c}
    </div>
  );
}
