using GerenciadorTarefasAPI.Data;
using GerenciadorTarefasAPI.DTOs;
using GerenciadorTarefasAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorTarefasAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TarefasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TarefasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> ListarTarefas()
        {
            var tarefas = await _context.Tarefas.ToListAsync();
            return Ok(tarefas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> BuscarTarefa(int id)
        {
            var tarefa = await _context.Tarefas.FindAsync(id);

            if (tarefa == null)
                return NotFound(new { mensagem = "Tarefa não encontrada" });

            return Ok(tarefa);
        }

        [HttpPost]
        public async Task<IActionResult> CriarTarefa(TarefaCreateDto dto)
        {
            var tarefa = new Tarefa
            {
                Titulo = dto.Titulo,
                Descricao = dto.Descricao,
                Categoria = dto.Categoria,
                Status = dto.Status,
                PrazoData = dto.PrazoData,
                PrazoHora = dto.PrazoHora,
                CriadoPor = dto.CriadoPor,
                AtribuidoPara = dto.AtribuidoPara
            };

            _context.Tarefas.Add(tarefa);
            await _context.SaveChangesAsync();

            return Ok(tarefa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarTarefa(int id, TarefaUpdateDto dto)
        {
            var tarefa = await _context.Tarefas.FindAsync(id);

            if (tarefa == null)
                return NotFound(new { mensagem = "Tarefa não encontrada" });

            if (!string.IsNullOrEmpty(dto.Titulo))
                tarefa.Titulo = dto.Titulo;

            if (dto.Descricao != null)
                tarefa.Descricao = dto.Descricao;

            if (dto.Categoria != null)
                tarefa.Categoria = dto.Categoria;

            if (dto.Status != null)
                tarefa.Status = dto.Status;

            if (dto.PrazoData.HasValue)
                tarefa.PrazoData = dto.PrazoData;

            if (dto.PrazoHora.HasValue)
                tarefa.PrazoHora = dto.PrazoHora;

            if (dto.AtribuidoPara.HasValue)
                tarefa.AtribuidoPara = dto.AtribuidoPara;

            await _context.SaveChangesAsync();

            return Ok(tarefa);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> ExcluirTarefa(int id)
        {
            var tarefa = await _context.Tarefas.FindAsync(id);

            if (tarefa == null)
                return NotFound(new { mensagem = "Tarefa não encontrada" });

            _context.Tarefas.Remove(tarefa);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Tarefa excluída com sucesso" });
        }
    }
}