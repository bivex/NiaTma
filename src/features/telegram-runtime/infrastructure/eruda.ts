export async function mountEruda(): Promise<void> {
  const { default: eruda } = await import('eruda');

  eruda.init();
  eruda.position({ x: window.innerWidth - 50, y: 0 });
}