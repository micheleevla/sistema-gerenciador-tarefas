namespace GerenciadorTarefasAPI.DTOs
{
    public class TarefaCreateDto
    {
        public string Titulo { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? Categoria { get; set; }
        public string Status { get; set; } = "afazer";
        public DateOnly? PrazoData { get; set; }
        public TimeOnly? PrazoHora { get; set; }
        public int CriadoPor { get; set; }
        public int? AtribuidoPara { get; set; }
    }
}