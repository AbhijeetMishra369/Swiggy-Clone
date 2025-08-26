declare global {
  interface Window { Razorpay: any }
}

export async function loadRazorpay(): Promise<boolean> {
  if ((window as any).Razorpay) return true;
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function openRazorpay(options: any) {
  const rz = new window.Razorpay(options);
  rz.open();
}