import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing resume ID" }, { status: 400 });
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(`${process.env.NEXT_PUBLIC_BASE_URL}/preview-resume/${id}`, {
    waitUntil: "networkidle0"
  });

  const pdf = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf"
    }
  });
}
