export function getAttachmentLabel(attachment: string) {
  const lastSegment = attachment.split("/").pop() || attachment;

  try {
    return decodeURIComponent(lastSegment);
  } catch {
    return lastSegment;
  }
}
