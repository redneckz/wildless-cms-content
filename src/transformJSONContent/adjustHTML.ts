export const adjustHTML = (html: string) => html.replace(/<(h\d)>/g, '<p class="$1">').replace(/<\/h\d>/g, '</p>');
