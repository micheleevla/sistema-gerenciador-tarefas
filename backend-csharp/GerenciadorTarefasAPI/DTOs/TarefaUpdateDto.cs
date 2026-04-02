namespace GerenciadorTarefasAPI.DTOs
{
    public class TarefaUpdateDto
    {
        public string? Titulo { get; set; }
        public string? Descricao { get; set; }
        public string? Categoria { get; set; }
        public string? Status { get; set; }
        public DateOnly? PrazoData { get; set; }
        public TimeOnly? PrazoHora { get; set; }
        public int? AtribuidoPara { get; set; }
    }
}