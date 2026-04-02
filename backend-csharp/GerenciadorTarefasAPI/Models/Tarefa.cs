using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciadorTarefasAPI.Models
{
    public class Tarefa
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Titulo { get; set; } = string.Empty;

        public string? Descricao { get; set; }

        [MaxLength(50)]
        public string? Categoria { get; set; }

        [Required]
        [MaxLength(30)]
        public string Status { get; set; } = "afazer";

        public DateOnly? PrazoData { get; set; }

        public TimeOnly? PrazoHora { get; set; }

        [Required]
        public int CriadoPor { get; set; }

        public int? AtribuidoPara { get; set; }

        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        [ForeignKey("CriadoPor")]
        public Usuario? UsuarioCriador { get; set; }

        [ForeignKey("AtribuidoPara")]
        public Usuario? UsuarioResponsavel { get; set; }
    }
}