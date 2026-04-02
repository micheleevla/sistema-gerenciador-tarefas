namespace GerenciadorTarefasAPI.DTOs
{
    public class UsuarioCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Senha { get; set; } = string.Empty;
        public string Tipo { get; set; } = "usuario";
    }
}